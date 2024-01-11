RegisterCommand(("show-nui-%s"):format(GetCurrentResourceName()), function()
    ToggleNuiFrame(true)
    Debug("[command:show-nui] ToggleNuiFrame called and set to true.")
end, false)
