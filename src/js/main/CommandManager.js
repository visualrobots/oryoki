function CommandManager() {
	this.register = {};
	this.template = undefined;
	this.menu = undefined;
	// @if NODE_ENV='development'
	c.log('[Command Manager] ✔');
	// @endif

	// Allow for renderer to set menus
	ipcMain.on('set-menu-enabled', function(event, menuLabel, subMenuLabel, value) {
	  this.setEnabled(menuLabel, subMenuLabel, value);
	}.bind(this));

	ipcMain.on('set-menu-checked', function(event, menuLabel, subMenuLabel, value) {
		this.setCheckbox(menuLabel, subMenuLabel, value);
	}.bind(this));

	this.createMenus();
}

CommandManager.prototype.registerCommand = function(scope, browserWindow, command) {

	if(scope == 'global') {
		if(!this.register[command.id]) {
			this.register[command.id] = command;
			electronLocalshortcut.register(this.register[command.id].accelerator, this.register[command.id].callback);
		}
	}
	else if (scope == 'local') {
		this.register[command.id] = command;
		electronLocalshortcut.register(browserWindow, this.register[command.id].accelerator, this.register[command.id].callback);
	}

}

CommandManager.prototype.unregisterAll = function(browserWindow) {
	electronLocalshortcut.unregisterAll(browserWindow);
}

CommandManager.prototype.createMenus = function() {
	var name = app.getName();
	this.template = [
		{
			label: name,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					label: 'Version ' + app.getVersion(),
					enabled: false
				},
				{
					type: 'separator'
				},
				{
					label: 'Preferences...',
					accelerator: 'CmdOrCtrl+,',
					click: function() {
						UserManager.openPreferencesFile();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Search Dictionary...',
					click: function() {
						shell.openItem(UserManager.user.paths.conf + '/' + 'search-dictionary.json');
					}
				},
				{
					label: 'Browse all Data...',
					click: function() {
						shell.openItem(UserManager.user.paths.conf);
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reset',
					submenu: [
						{
							type: 'separator'
						},
						{
							label: 'Preferences',
							click: function() {
								UserManager.reset('Preferences', 'oryoki-preferences.json', 'factory.json');
							}
						},
						{
							label: 'Search Dictionary',
							click: function() {
								UserManager.reset('Search dictionary', 'search-dictionary.json', 'search-dictionary.json');
							}
						}
					]
				},
				{
					type: 'separator'
				},
				{
					label: 'Clear Caches',
					click: function() {
						if(Oryoki) Oryoki.clearCaches();
					}
				},
				{
					label: 'Clear Local Storage',
					click: function() {
						if(Oryoki) Oryoki.clearLocalStorage();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + name,
					accelerator: 'CmdOrCtrl+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'CmdOrCtrl+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click: function() { app.quit() }
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					label: 'New Window',
					accelerator: 'CmdOrCtrl+N',
					click: function() {
						if(Oryoki) Oryoki.createWindow();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Close Window',
					accelerator: 'CmdOrCtrl+W',
					role: 'close'
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Title Bar',
					accelerator: 'CmdOrCtrl+/',
					type: 'checkbox',
					click:function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleHandle();
						}
					}
				},
				{
					label: 'Toggle Omnibox',
					accelerator: 'CmdOrCtrl+L',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleOmnibox();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.reload();
							}
						}
					}
				},
				{
					label: 'Hard Reload',
					accelerator: 'CmdOrCtrl+Shift+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.reloadIgnoringCache();
							}
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Fullscreen',
					accelerator: 'Cmd+Ctrl+F',
					type: 'checkbox',
					click: function() { if(Oryoki) Oryoki.toggleFullScreen() }
				},
				{
					type: 'separator'
				},
				{
					label: 'Navigate Back',
					accelerator: 'CmdOrCtrl+Left',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateBack();
						}
					}
				},
				{
					label: 'Navigate Forward',
					accelerator: 'CmdOrCtrl+Right',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateForward();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Downloads',
					click: function() {
						if(Oryoki) { Oryoki.goToDownloads() }
					}
				}
			]
		},
		{
			label: 'Tools',
			submenu: [
				{
					label: 'Save Screenshot',
					accelerator: 'CmdOrCtrl+Shift+`',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.takeScreenshot();
						}
					}
				},
				{
					label: 'Copy Screenshot',
					accelerator: 'CmdOrCtrl+Shift+C',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.copyScreenshot(Oryoki.focusedWindow.id);
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Start Recording',
					accelerator: 'CmdOrCtrl+Shift+P',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.startRecording();
						}
					}
				},
				{
					label: 'Stop Recording',
					accelerator: 'CmdOrCtrl+Alt+Shift+P',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.stopRecording();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Mini Console',
					accelerator: 'CmdOrCtrl+Alt+C',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleConsole();
						}
					}
				},
				{
					label: 'Toggle Devtools',
					accelerator: 'CmdOrCtrl+Alt+I',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.toggleDevTools()
							}
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Web Plugins',
					type: 'checkbox',
					checked: true,
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleWebPlugins();
						}
					}
				},
				{
					label: 'Browse Web Plugins...',
					click: function() {
						shell.openItem(UserManager.user.paths.webPlugins);
					}
				}
			]
		},
		{
			label: 'Window',
			role: 'window',
			submenu: [
				{
					label: 'Window Helper',
					accelerator: 'CmdOrCtrl+Alt+M',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleWindowHelper();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Minimize',
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize'
				},
				{
					type: 'separator'
				},
				{
					label: 'Float on Top',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.setAlwaysOnTopToggle();
						}
					}
				}
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Feedback',
					click: function() {
						var osVersion = require('os').release();
						var oryokiVersion = Oryoki.versions.oryoki;
						require("openurl").open("mailto:write@oryoki.io?subject=Ōryōki ⭕️ Feedback&body=\n\nŌryōki: v."+oryokiVersion+"\nOperating System: Darwin v."+osVersion);
					}
				}
			]
		}
	];
	this.menu = Menu.buildFromTemplate(this.template);
	Menu.setApplicationMenu(this.menu);
}

CommandManager.prototype.toggleChecked = function(menuLabel, subMenuLabel) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked == !submenu[0].checked;
}

CommandManager.prototype.setCheckbox = function(menuLabel, subMenuLabel, value) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked = value;
}

CommandManager.prototype.setEnabled = function(menuLabel, subMenuLabel, value) {
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].enabled = value;
}

CommandManager.prototype.getMenuByLabel = function(menuLabel) {
	return this.menu.items.filter(item => item.label == menuLabel);
}

CommandManager.prototype.getSubMenuByLabel = function(menu, subMenuLabel) {
	return menu[0].submenu.items.filter(item => item.label == subMenuLabel);
}