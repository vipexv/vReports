Config = {
    Debug = true,
    UseDiscordRestAPI = true, -- Replaces the ACE Permission System with one relying on the Discord REST API where players get their permissions based on their roles, make sure to configure the bot token and guild id in sv_config.lua
    AcePerm = "vadmin.staff", -- Uses the Deafult ACE Permission System, only works if you don't UseDiscordRestAPI set to true.
    RoleIDs = {               -- Only Used if UseDiscordRestAPI is set to true, feel free to add multiple roles below using the example.
        ["839129247918194732"] = true
    },
    ReportCommand = "report",      -- The name of the report command for normal players.
    ReportMenuCommand = "reports", -- The name of the command to open the reports menu for staff members.
}
