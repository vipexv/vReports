RegisterCommand(Config.ReportCommand, function()
    UIMessage("nui:state:reportmenu", true)
    SetNuiFocus(true, true)
end, false)

RegisterCommand(Config.ReportMenuCommand, function()
    if not PlayerData or not PlayerData.isStaff then
        return Debug("[command:show-nui] PlayerData is either null or player isn't staff, PlayerData: ",
            json.encode(PlayerData))
    end

    -- TriggerServerEvent("reportmenu:server:cb:reports")

    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
