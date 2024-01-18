Script = {
    state = {
        settingsLoaded = false,
    }
}

PlayerData = {}

---@type ActiveReport[]
MyReports = {}

SetTimeout(2000, function()
    Debug("[client/core] Sending the scriptConfig to the NUI.")
    UIMessage("nui:state:scriptconfig", Config)
end)
