RegisterCommand(Config.ReportCommand, function()
    UIMessage("nui:state:reportmenu", true)
    SetNuiFocus(true, true)
end, false)

RegisterCommand(Config.ReportMenuCommand, function()
    UIMessage("nui:state:playerdata", PlayerData)
    UIMessage("nui:state:myreports", MyReports)

    if PlayerData.isStaff then
        TriggerServerEvent("reportmenu:server:cb:leaderboard")
    end

    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
