import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Folder, 
  Globe, 
  Clock, 
  Tag, 
  Download, 
  Upload, 
  Settings, 
  Pause, 
  Play,
  X,
  ChevronRight,
  ChevronDown,
  Star,
  Archive
} from "@phosphor-icons/react"
import { toast } from 'sonner'

// Types for our data structures
interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  lastAccessed: number
  suspended: boolean
  tags: string[]
}

interface TabGroup {
  id: string
  name: string
  color: string
  tabs: Tab[]
  collapsed: boolean
  parentId?: string
  children?: TabGroup[]
}

interface Session {
  id: string
  name: string
  created: number
  groups: TabGroup[]
  tabs: Tab[]
}

function App() {
  // State management using useKV for persistence
  const [tabGroups, setTabGroups] = useKV<TabGroup[]>("tab-groups", [])
  const [sessions, setSessions] = useKV<Session[]>("sessions", [])
  const [tags, setTags] = useKV<string[]>("available-tags", [])
  
  // Local state for UI
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTabs, setSelectedTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("current")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupColor, setNewGroupColor] = useState("#1e40af")
  const [groupsCollapsed, setGroupsCollapsed] = useState(false)

  // Current tabs from Chrome API or mock data
  const [currentTabs, setCurrentTabs] = useState<Tab[]>([])
  const [isExtensionMode, setIsExtensionMode] = useState(false)

  // Check if running as Chrome extension
  React.useEffect(() => {
    const isExtension = !!(window.chrome && chrome.runtime && chrome.runtime.id)
    setIsExtensionMode(isExtension)
    
    if (isExtension) {
      loadTabsFromExtension()
      loadGroupsFromExtension()
    } else {
      // Use mock data when not in extension mode
      setCurrentTabs([
        {
          id: "1",
          title: "GitHub - Tab Manager Pro",
          url: "https://github.com/user/tab-manager-pro",
          favicon: "https://github.com/favicon.ico",
          lastAccessed: Date.now() - 300000,
          suspended: false,
          tags: ["development", "github"]
        },
        {
          id: "2", 
          title: "React Documentation",
          url: "https://react.dev",
          favicon: "https://react.dev/favicon.ico",
          lastAccessed: Date.now() - 600000,
          suspended: false,
          tags: ["development", "react"]
        },
        {
          id: "3",
          title: "Tailwind CSS Components",
          url: "https://tailwindui.com/components",
          favicon: "https://tailwindui.com/favicon.ico", 
          lastAccessed: Date.now() - 1200000,
          suspended: true,
          tags: ["design", "css"]
        },
        {
          id: "4",
          title: "Chrome Extension Documentation",
          url: "https://developer.chrome.com/docs/extensions",
          favicon: "https://developer.chrome.com/favicon.ico",
          lastAccessed: Date.now() - 1800000,
          suspended: false,
          tags: ["development", "chrome"]
        }
      ])
    }
  }, [])

  // Load tabs from Chrome extension
  const loadTabsFromExtension = async () => {
    try {
      const response = await sendMessageToBackground({ action: 'getCurrentTabs' })
      if (response.success) {
        setCurrentTabs(response.data)
      }
    } catch (error) {
      console.error('Failed to load tabs from extension:', error)
      toast.error('Failed to load tabs from browser')
    }
  }

  // Load groups from Chrome extension
  const loadGroupsFromExtension = async () => {
    try {
      const response = await sendMessageToBackground({ action: 'getTabGroups' })
      if (response.success) {
        setTabGroups(response.data)
      }
    } catch (error) {
      console.error('Failed to load groups from extension:', error)
    }
  }

  // Send message to background script
  const sendMessageToBackground = (message: any) => {
    return new Promise<any>((resolve, reject) => {
      if (!chrome.runtime?.sendMessage) {
        reject(new Error('Chrome extension API not available'))
        return
      }

      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve(response)
        }
      })
    })
  }

  // Filter tabs based on search
  const filteredTabs = currentTabs.filter(tab => 
    tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredGroups = tabGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tabs.some(tab => 
      tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  )

  // Create a new tab group (updated for extension integration)
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name")
      return
    }

    if (selectedTabs.length === 0) {
      toast.error("Please select at least one tab")
      return
    }

    try {
      if (isExtensionMode) {
        // Use Chrome extension API
        const response = await sendMessageToBackground({
          action: 'createTabGroup',
          data: {
            name: newGroupName,
            color: newGroupColor,
            tabIds: selectedTabs
          }
        })

        if (response.success) {
          toast.success(`Created group "${newGroupName}" with ${response.data.tabCount} tabs`)
          await loadGroupsFromExtension()
          setSelectedTabs([])
          setNewGroupName("")
        }
      } else {
        // Fallback for non-extension mode
        const selectedTabData = currentTabs.filter(tab => selectedTabs.includes(tab.id))
        const newGroup: TabGroup = {
          id: Date.now().toString(),
          name: newGroupName,
          color: newGroupColor,
          tabs: selectedTabData,
          collapsed: false
        }

        setTabGroups(current => [...current, newGroup])
        setSelectedTabs([])
        setNewGroupName("")
        toast.success(`Created group "${newGroupName}" with ${selectedTabData.length} tabs`)
      }
    } catch (error) {
      console.error('Failed to create group:', error)
      toast.error('Failed to create group')
    }
  }

  // Toggle tab suspension (updated for extension integration)
  const toggleTabSuspension = async (tabId: string) => {
    try {
      if (isExtensionMode) {
        const tab = currentTabs.find(t => t.id === tabId)
        if (!tab) return

        if (tab.suspended) {
          await sendMessageToBackground({ action: 'restoreTab', tabId })
          toast.info('Tab restored')
        } else {
          await sendMessageToBackground({ action: 'suspendTab', tabId })
          toast.info('Tab suspended')
        }

        // Refresh tabs
        await loadTabsFromExtension()
      } else {
        // Mock functionality for non-extension mode
        toast.info("Tab suspension requires Chrome extension")
      }
    } catch (error) {
      console.error('Failed to toggle tab suspension:', error)
      toast.error('Failed to update tab state')
    }
  }

  // Toggle group collapse
  const toggleGroupCollapse = (groupId: string) => {
    setTabGroups(current => 
      current.map(group => 
        group.id === groupId 
          ? { ...group, collapsed: !group.collapsed }
          : group
      )
    )
  }

  // Export functionality
  const exportData = (format: 'csv' | 'txt') => {
    let content = ""
    
    if (format === 'csv') {
      content = "Group,Tab Title,URL,Tags\n"
      tabGroups.forEach(group => {
        group.tabs.forEach(tab => {
          content += `"${group.name}","${tab.title}","${tab.url}","${tab.tags.join(';')}"\n`
        })
      })
    } else {
      content = "Tab Manager Pro Export\n" + "=".repeat(25) + "\n\n"
      tabGroups.forEach(group => {
        content += `${group.name}:\n`
        group.tabs.forEach(tab => {
          content += `  - ${tab.title}\n    ${tab.url}\n    Tags: ${tab.tags.join(', ')}\n\n`
        })
        content += "\n"
      })
    }

    // Download file
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tab-manager-export.${format}`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success(`Exported data as ${format.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Folder weight="bold" className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Tab Manager Pro</h1>
                <div className="flex items-center gap-2">
                  {isExtensionMode ? (
                    <Badge variant="default" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Extension Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tabs, groups, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Extension Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Auto-suspend inactive tabs after:</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Export Data:</Label>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                          <Download className="w-4 h-4 mr-2" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportData('txt')}>
                          <Download className="w-4 h-4 mr-2" />
                          TXT
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Tabs</TabsTrigger>
            <TabsTrigger value="groups">Tab Groups</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          {/* Current Tabs Tab */}
          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-medium">Current Window</h2>
                <Badge variant="secondary">{currentTabs.length} tabs</Badge>
                {selectedTabs.length > 0 && (
                  <Badge variant="outline">{selectedTabs.length} selected</Badge>
                )}
              </div>
              
              {selectedTabs.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tab Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input
                          id="group-name"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter group name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="group-color">Color</Label>
                        <div className="flex space-x-2 mt-2">
                          {['#1e40af', '#dc2626', '#059669', '#d97706', '#7c3aed', '#be185d'].map(color => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-ring"
                              style={{ backgroundColor: color }}
                              onClick={() => setNewGroupColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                      <Button onClick={createGroup} className="w-full">Create Group</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-1">
              {filteredTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-3 p-1.5 rounded-md border cursor-pointer transition-all hover:bg-muted/30 hover:shadow-sm ${
                    selectedTabs.includes(tab.id) ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
                  } ${tab.suspended ? 'opacity-60' : ''}`}
                  onClick={() => {
                    setSelectedTabs(current => 
                      current.includes(tab.id) 
                        ? current.filter(id => id !== tab.id)
                        : [...current, tab.id]
                    )
                  }}
                >
                  <div className="w-4 h-4 rounded bg-muted flex-shrink-0">
                    {tab.favicon ? (
                      <img src={tab.favicon} alt="" className="w-4 h-4 rounded" />
                    ) : (
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs text-foreground truncate">
                      {tab.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {tab.url}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {tab.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTabSuspension(tab.id)
                      }}
                      className="h-5 w-5 p-0"
                    >
                      {tab.suspended ? (
                        <Play className="w-2.5 h-2.5" />
                      ) : (
                        <Pause className="w-2.5 h-2.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-medium">Tab Groups</h2>
                <Badge variant="secondary">{tabGroups.length} groups</Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setGroupsCollapsed(!groupsCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  {groupsCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {!groupsCollapsed && (
              <>
                {tabGroups.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">No groups yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select tabs from the Current Tabs view and create your first group
                      </p>
                      <Button onClick={() => setActiveTab("current")}>
                        Go to Current Tabs
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredGroups.map((group) => (
                      <Card key={group.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: group.color }}
                              />
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <Badge variant="secondary">{group.tabs.length} tabs</Badge>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleGroupCollapse(group.id)}
                              className="h-8 w-8 p-0"
                            >
                              {group.collapsed ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        
                        {!group.collapsed && (
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {group.tabs.map((tab) => (
                                <div key={tab.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                                  <div className="w-4 h-4 rounded bg-muted flex-shrink-0">
                                    {tab.favicon ? (
                                      <img src={tab.favicon} alt="" className="w-4 h-4 rounded" />
                                    ) : (
                                      <Globe className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-foreground truncate">
                                      {tab.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {tab.url}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    {tab.tags.map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Saved Sessions</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <Archive className="w-4 h-4 mr-2" />
                  Save Current Session
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No saved sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Sessions will be automatically saved when you close Chrome, or you can save them manually
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Universal Search</h2>
              <Badge variant="secondary">
                {filteredTabs.length + filteredGroups.reduce((acc, g) => acc + g.tabs.length, 0)} results
              </Badge>
            </div>

            {searchQuery ? (
              <div className="space-y-4">
                {filteredTabs.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-3">Current Tabs</h3>
                    <div className="grid gap-2">
                      {filteredTabs.map((tab) => (
                        <div key={tab.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{tab.title}</h4>
                            <p className="text-xs text-muted-foreground">{tab.url}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredGroups.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-3">Groups</h3>
                    <div className="grid gap-2">
                      {filteredGroups.map((group) => (
                        <div key={group.id} className="p-3 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center space-x-3 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: group.color }}
                            />
                            <h4 className="font-medium text-sm">{group.name}</h4>
                            <Badge variant="outline" className="text-xs">{group.tabs.length} tabs</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Search everything</h3>
                  <p className="text-sm text-muted-foreground">
                    Find tabs, groups, and sessions by title, URL, or tags
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App