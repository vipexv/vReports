RegisterCommand(("show-nui-%s"):format(GetCurrentResourceName()), function()
    if not PlayerData or not PlayerData.isStaff then
        return Debug("[command:show-nui] PlayerData is either null or player isn't staff, PlayerData: ",
            json.encode(PlayerData))
    end

    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
