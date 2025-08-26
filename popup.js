// Chrome Extension Popup Script
// Creates a mini version of the tab manager for the popup

class PopupManager {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Get current tabs and groups from background script
      const [tabsResponse, groupsResponse] = await Promise.all([
        this.sendMessage({ action: 'getCurrentTabs' }),
        this.sendMessage({ action: 'getTabGroups' })
      ]);

      const tabs = tabsResponse.data || [];
      const groups = groupsResponse.data || [];

      this.renderPopup(tabs, groups);
    } catch (error) {
      console.error('Failed to load popup:', error);
      this.renderError(error.message);
    }
  }

  async sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    });
  }

  renderPopup(tabs, groups) {
    const root = document.getElementById('popup-root');
    
    root.innerHTML = `
      <div style="padding: 16px; background: #f8fafc; height: 100%; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 12px;">📁</span>
            </div>
            <h1 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Tab Manager Pro</h1>
          </div>
          <button id="open-full" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
            Open Full
          </button>
        </div>

        <!-- Quick Stats -->
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="flex: 1; background: white; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${tabs.length}</div>
            <div style="font-size: 11px; color: #64748b;">Open Tabs</div>
          </div>
          <div style="flex: 1; background: white; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${groups.length}</div>
            <div style="font-size: 11px; color: #64748b;">Groups</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: #475569;">Quick Actions</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="save-session" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">
              Save Session
            </button>
            <button id="suspend-tabs" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">
              Suspend Inactive
            </button>
          </div>
        </div>

        <!-- Recent Tabs -->
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: #475569;">Recent Tabs</h3>
          <div style="max-height: 200px; overflow-y: auto;">
            ${this.renderTabList(tabs.slice(0, 8))}
          </div>
        </div>

        <!-- Tab Groups -->
        ${groups.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: #475569;">Tab Groups</h3>
          <div style="max-height: 150px; overflow-y: auto;">
            ${this.renderGroupList(groups.slice(0, 3))}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  renderTabList(tabs) {
    return tabs.map(tab => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 6px; background: white; border-radius: 6px; margin-bottom: 4px; border: 1px solid #e2e8f0; cursor: pointer;" data-tab-id="${tab.id}">
        <div style="width: 14px; height: 14px; border-radius: 2px; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">
          ${tab.favicon ? `<img src="${tab.favicon}" style="width: 12px; height: 12px; border-radius: 2px;">` : '🌐'}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 11px; font-weight: 500; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${tab.title || 'Untitled'}
          </div>
          <div style="font-size: 9px; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${this.formatUrl(tab.url)}
          </div>
        </div>
      </div>
    `).join('');
  }

  renderGroupList(groups) {
    return groups.map(group => `
      <div style="background: white; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8fafc;">
          <div style="width: 12px; height: 12px; border-radius: 50%;" style="background-color: ${group.color};"></div>
          <div style="flex: 1; font-size: 12px; font-weight: 500; color: #1e293b;">${group.name}</div>
          <div style="font-size: 10px; color: #64748b;">${group.tabs.length} tabs</div>
        </div>
        <div style="padding: 4px 8px;">
          ${group.tabs.slice(0, 3).map(tab => `
            <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0; cursor: pointer;" data-tab-id="${tab.id}">
              <div style="width: 10px; height: 10px; background: #f1f5f9; border-radius: 2px;"></div>
              <div style="font-size: 10px; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                ${tab.title}
              </div>
            </div>
          `).join('')}
          ${group.tabs.length > 3 ? `<div style="font-size: 9px; color: #64748b; text-align: center; padding: 4px;">+${group.tabs.length - 3} more tabs</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  formatUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  attachEventListeners() {
    // Open full app
    document.getElementById('open-full')?.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
      window.close();
    });

    // Save session
    document.getElementById('save-session')?.addEventListener('click', async () => {
      try {
        await this.sendMessage({ action: 'saveSession', name: `Session ${new Date().toLocaleTimeString()}` });
        this.showToast('Session saved!');
      } catch (error) {
        this.showToast('Failed to save session', true);
      }
    });

    // Suspend inactive tabs
    document.getElementById('suspend-tabs')?.addEventListener('click', async () => {
      this.showToast('Feature coming soon!');
    });

    // Tab clicks - switch to tab
    document.querySelectorAll('[data-tab-id]').forEach(element => {
      element.addEventListener('click', async () => {
        const tabId = parseInt(element.dataset.tabId);
        try {
          await chrome.tabs.update(tabId, { active: true });
          window.close();
        } catch (error) {
          console.error('Failed to switch to tab:', error);
        }
      });
    });
  }

  showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${isError ? '#ef4444' : '#10b981'};
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 11px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  renderError(error) {
    const root = document.getElementById('popup-root');
    root.innerHTML = `
      <div style="padding: 20px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
        <div style="color: #ef4444; font-size: 14px; margin-bottom: 8px;">⚠️ Error</div>
        <div style="color: #64748b; font-size: 12px; margin-bottom: 16px;">${error}</div>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PopupManager());
} else {
  new PopupManager();
}