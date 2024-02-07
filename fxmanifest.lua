fx_version "cerulean"
game 'gta5'

lua54 'yes'
use_experimental_fxv2_oal "yes"

author 'vipex [Discord: vipex.v]'
description 'Advanced Free and Standalone Report Menu for FiveM'
ui_page 'web/dist/index.html'

shared_scripts {
	"config.lua",
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
	"sv_config.lua",
	"server/modules/**/*",
	"server/classes/**/*",
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
