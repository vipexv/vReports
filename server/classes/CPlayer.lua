CPlayer = {}

function CPlayer:new(player)
    if not player then
        return Debug("(Error) `CPlayer:new` function was called but the first param is null.")
    end

    local isStaff = false

    local discordId = GetDiscordID(player)
    local playerName = GetPlayerName(player)

    if not Config.UseDiscordRestAPI then
        if IsPlayerAceAllowed(player, Config.AcePerm) then
            isStaff = true
            OnlineStaff[tonumber(player)] = {}
            TriggerClientEvent("vadmin:cb:updatePermissions", player, Config.AllowedPermissions)
            Debug(("[func:CPlayer:new] (ACEPermissions) %s (ID - %s) was authenticated as staff."):format(
                playerName, player))
        end
    else
        local discordRoles = GetDiscordRoles(discordId, player)

        if discordRoles then
            for i = 1, #discordRoles do
                local discordRoleId = discordRoles[i]
                if discordRoleId == Config.RoleID then
                    isStaff = true
                    OnlineStaff[tonumber(player)] = {}
                    Debug(("[func:CPlayer:new] (DiscordAPI) %s (ID - %s) was authenticated as staff."):format(
                        playerName, player))
                end
            end
        end
    end

    local obj = {
        name = playerName,
        id = player,
        identifiers = GetPlayerIdentifiersWithoutIP(player),
        isStaff = isStaff,
    }

    TriggerClientEvent("reportmenu:state:playerdata", player, obj)

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function CPlayer:displayInfo()
    Debug(("Data: %s"):format(json.encode(self)))
end
