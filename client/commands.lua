RegisterCommand(Config.ReportCommand, function()
    UIMessage("nui:state:reportmenu", true)
    SetNuiFocus(true, true)
end, false)

RegisterCommand(Config.ReportMenuCommand, function()
    if not Script.state.settingsLoaded then
        Debug("Loading settings.")
        local settingsKvp = GetResourceKvpString("reportmenu:settings")
        if settingsKvp then
            local settings = json.decode(settingsKvp)
            UIMessage("nui:state:settings", settings)
            Debug("Settings loaded: ", settingsKvp)
        end
    end
    UIMessage("nui:state:playerdata", PlayerData)
    UIMessage("nui:state:myreports", MyReports)

    if PlayerData.isStaff then
        TriggerServerEvent("reportmenu:server:cb:leaderboard")
    end

    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
