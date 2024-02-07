RegisterCommand(Config.ReportCommand, function()
    UIMessage("nui:state:reportmenu", true)
    SetNuiFocus(true, true)
end, false)

RegisterCommand(Config.ReportMenuCommand, function()
    if not Script.state.settingsLoaded then
        local settingsKvp = GetResourceKvpString("reportmenu:settings")
        if settingsKvp then
            local settings = json.decode(settingsKvp)
            UIMessage("nui:state:settings", settings)
            Debug("Settings loaded: ", settingsKvp)
        end
        Script.state.settingsLoaded = true
        if PlayerData.isStaff then
            Debug("Updating active reports. \n PlayerData: ", json.encode(PlayerData))
            TriggerServerEvent("reportmenu:server:cb:reports")
        end
    end

    UIMessage("nui:state:playerdata", PlayerData)
    UIMessage("nui:state:myreports", MyReports)

    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
