fx_version "cerulean"
lua54 'yes'
game 'gta5'

author 'vipex'
ui_page 'web/dist/index.html'

shared_scripts {
	"shared/main.lua",
	"shared/types.lua"
}

client_scripts {
	'client/cl_utils.lua',
	'client/Classes/**/*',
	'client/core.lua',
	'client/events.lua',
	'client/nui_callbacks.lua',
	'client/commands.lua',
}

server_scripts {
	"server/modules/**/*",
	"server/classes/**/*",
	"server/versionChecker.lua",
	"server/sv_utils.lua",
	"server/Classes/**/*",
	"server/core.lua",
	"server/events.lua",
	"server/commands.lua",
}

files {
	'web/dist/index.html',
	'web/dist/**/*',
}
