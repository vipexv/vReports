---@class nearestPlayer
---@field id string | number
---@field name string | number
---@field distance number

---@class ActiveReport
---@field id number | string
---@field playerName string
---@field type "Bug" | "Question" | "Gameplay"
---@field description string
---@field timedate string
---@field title string
---@field nearestPlayers nearestPlayer[]
---@field messages message[]
---@field reportId string

---@class OnlineStaff
---@field id number | string
---@field identifiers table
---@field concludedReportsThisSession number


---@class PlayerData
---@field name string
---@field identifiers table
---@field isStaff boolean

---@class message
---@field data string
---@field timedate string
