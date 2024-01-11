Config = {
    Debug = true,
    UseDiscordRestAPI = true, -- Replaces the ACE Permission System with one relying on the Discord REST API where players get their permissions based on their roles, make sure to configure the bot token and guild id in sv_config.lua
    AcePerm = "vadmin.staff", -- Uses the Deafult ACE Permission System, only works if you don't UseDiscordRestAPI set to true.
    RoleID = ""               -- Only Used iff UseDiscordRestAPI is set to true.
}
