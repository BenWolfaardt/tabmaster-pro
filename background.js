// Chrome Extension Background Script
// Handles tab management, auto-save, and cross-device sync

class TabManagerBackground {
  constructor() {
    this.setupEventListeners();
    this.autoSaveInterval = null;
    this.startAutoSave();
  }

  setupEventListeners() {
    // Tab events
    chrome.tabs.onCreated.addListener((tab) => this.handleTabCreated(tab));
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => this.handleTabUpdated(tabId, changeInfo, tab));
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => this.handleTabRemoved(tabId, removeInfo));
    chrome.tabs.onActivated.addListener((activeInfo) => this.handleTabActivated(activeInfo));

    // Window events
    chrome.windows.onRemoved.addListener((windowId) => this.handleWindowClosed(windowId));
    
    // Tab group events (Chrome 88+)
    if (chrome.tabGroups) {
      chrome.tabGroups.onCreated.addListener((group) => this.handleGroupCreated(group));
      chrome.tabGroups.onUpdated.addListener((group) => this.handleGroupUpdated(group));
      chrome.tabGroups.onRemoved.addListener((group) => this.handleGroupRemoved(group));
    }

    // Extension messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  async handleTabCreated(tab) {
    console.log('Tab created:', tab);
    await this.saveCurrentSession();
  }

  async handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      await this.updateTabData(tab);
    }
  }

  async handleTabRemoved(tabId, removeInfo) {
    console.log('Tab removed:', tabId);
    await this.saveCurrentSession();
  }

  async handleTabActivated(activeInfo) {
    // Update last accessed time
    await this.updateTabLastAccessed(activeInfo.tabId);
  }

  async handleWindowClosed(windowId) {
    console.log('Window closed, auto-saving session:', windowId);
    await this.saveCurrentSession();
  }

  async handleGroupCreated(group) {
    console.log('Tab group created:', group);
    await this.syncTabGroups();
  }

  async handleGroupUpdated(group) {
    console.log('Tab group updated:', group);
    await this.syncTabGroups();
  }

  async handleGroupRemoved(group) {
    console.log('Tab group removed:', group);
    await this.syncTabGroups();
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getCurrentTabs':
          const tabs = await this.getCurrentTabs();
          sendResponse({ success: true, data: tabs });
          break;

        case 'getTabGroups':
          const groups = await this.getTabGroups();
          sendResponse({ success: true, data: groups });
          break;

        case 'createTabGroup':
          const result = await this.createTabGroup(request.data);
          sendResponse({ success: true, data: result });
          break;

        case 'suspendTab':
          await this.suspendTab(request.tabId);
          sendResponse({ success: true });
          break;

        case 'restoreTab':
          await this.restoreTab(request.tabId);
          sendResponse({ success: true });
          break;

        case 'saveSession':
          await this.saveSession(request.name);
          sendResponse({ success: true });
          break;

        case 'loadSession':
          await this.loadSession(request.sessionId);
          sendResponse({ success: true });
          break;

        case 'searchTabs':
          const searchResults = await this.searchTabs(request.query);
          sendResponse({ success: true, data: searchResults });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getCurrentTabs() {
    const tabs = await chrome.tabs.query({});
    return tabs.map(tab => ({
      id: tab.id.toString(),
      title: tab.title || 'Untitled',
      url: tab.url || '',
      favicon: tab.favIconUrl,
      lastAccessed: Date.now(),
      suspended: false, // We'll implement suspension separately
      tags: await this.getTabTags(tab.id),
      windowId: tab.windowId,
      index: tab.index,
      pinned: tab.pinned,
      groupId: tab.groupId
    }));
  }

  async getTabGroups() {
    if (!chrome.tabGroups) {
      return [];
    }

    const groups = await chrome.tabGroups.query({});
    const result = [];

    for (const group of groups) {
      const tabs = await chrome.tabs.query({ groupId: group.id });
      result.push({
        id: group.id.toString(),
        name: group.title || `Group ${group.id}`,
        color: group.color || '#1e40af',
        collapsed: group.collapsed,
        tabs: tabs.map(tab => ({
          id: tab.id.toString(),
          title: tab.title || 'Untitled',
          url: tab.url || '',
          favicon: tab.favIconUrl,
          lastAccessed: Date.now(),
          suspended: false,
          tags: []
        }))
      });
    }

    return result;
  }

  async createTabGroup(groupData) {
    const { name, color, tabIds } = groupData;
    
    // Get the tabs to group
    const tabs = await chrome.tabs.query({});
    const tabsToGroup = tabs.filter(tab => tabIds.includes(tab.id.toString()));
    
    if (tabsToGroup.length === 0) {
      throw new Error('No valid tabs found to group');
    }

    // Create the group
    const groupId = await chrome.tabs.group({ 
      tabIds: tabsToGroup.map(tab => tab.id) 
    });

    // Update group properties
    await chrome.tabGroups.update(groupId, {
      title: name,
      color: color.replace('#', '').toLowerCase()
    });

    return { groupId, tabCount: tabsToGroup.length };
  }

  async suspendTab(tabId) {
    // For now, we'll just store the suspended state
    // In a full implementation, you'd replace the tab content with a suspended page
    const suspendedTabs = await this.getSuspendedTabs();
    suspendedTabs.add(tabId);
    await chrome.storage.local.set({ suspendedTabs: Array.from(suspendedTabs) });
  }

  async restoreTab(tabId) {
    const suspendedTabs = await this.getSuspendedTabs();
    suspendedTabs.delete(tabId);
    await chrome.storage.local.set({ suspendedTabs: Array.from(suspendedTabs) });
  }

  async getSuspendedTabs() {
    const result = await chrome.storage.local.get(['suspendedTabs']);
    return new Set(result.suspendedTabs || []);
  }

  async getTabTags(tabId) {
    const result = await chrome.storage.local.get([`tab-tags-${tabId}`]);
    return result[`tab-tags-${tabId}`] || [];
  }

  async updateTabData(tab) {
    // Store tab metadata
    await chrome.storage.local.set({
      [`tab-${tab.id}`]: {
        title: tab.title,
        url: tab.url,
        lastAccessed: Date.now(),
        favicon: tab.favIconUrl
      }
    });
  }

  async updateTabLastAccessed(tabId) {
    const key = `tab-${tabId}`;
    const result = await chrome.storage.local.get([key]);
    if (result[key]) {
      result[key].lastAccessed = Date.now();
      await chrome.storage.local.set({ [key]: result[key] });
    }
  }

  async saveCurrentSession() {
    const tabs = await this.getCurrentTabs();
    const groups = await this.getTabGroups();
    
    const session = {
      id: Date.now().toString(),
      name: `Auto-saved ${new Date().toLocaleString()}`,
      created: Date.now(),
      tabs,
      groups
    };

    // Store the session
    const sessions = await this.getSessions();
    sessions.unshift(session);
    
    // Keep only last 50 sessions
    sessions.splice(50);
    
    await chrome.storage.local.set({ sessions });
  }

  async saveSession(name) {
    const tabs = await this.getCurrentTabs();
    const groups = await this.getTabGroups();
    
    const session = {
      id: Date.now().toString(),
      name: name || `Session ${new Date().toLocaleString()}`,
      created: Date.now(),
      tabs,
      groups
    };

    const sessions = await this.getSessions();
    sessions.unshift(session);
    
    await chrome.storage.local.set({ sessions });
    return session;
  }

  async getSessions() {
    const result = await chrome.storage.local.get(['sessions']);
    return result.sessions || [];
  }

  async loadSession(sessionId) {
    const sessions = await this.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Close current tabs (optional)
    // const currentTabs = await chrome.tabs.query({});
    // await Promise.all(currentTabs.map(tab => chrome.tabs.remove(tab.id)));

    // Open session tabs
    for (const tab of session.tabs) {
      await chrome.tabs.create({
        url: tab.url,
        pinned: tab.pinned
      });
    }

    return session;
  }

  async searchTabs(query) {
    const tabs = await this.getCurrentTabs();
    const groups = await this.getTabGroups();
    
    const lowerQuery = query.toLowerCase();
    
    const matchingTabs = tabs.filter(tab =>
      tab.title.toLowerCase().includes(lowerQuery) ||
      tab.url.toLowerCase().includes(lowerQuery) ||
      tab.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    const matchingGroups = groups.filter(group =>
      group.name.toLowerCase().includes(lowerQuery) ||
      group.tabs.some(tab =>
        tab.title.toLowerCase().includes(lowerQuery) ||
        tab.url.toLowerCase().includes(lowerQuery)
      )
    );

    return {
      tabs: matchingTabs,
      groups: matchingGroups
    };
  }

  async syncTabGroups() {
    // Sync with storage for the web interface
    const groups = await this.getTabGroups();
    await chrome.storage.local.set({ 'tab-groups': groups });
  }

  startAutoSave() {
    // Auto-save session every 5 minutes
    this.autoSaveInterval = setInterval(() => {
      this.saveCurrentSession();
    }, 5 * 60 * 1000);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
}

// Initialize the background script
const tabManager = new TabManagerBackground();

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Tab Manager Pro started');
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Tab Manager Pro installed:', details.reason);
});