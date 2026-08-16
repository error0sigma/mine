local SERVER_URL = "https://onrender.com" -- ЗАМЕНИТЕ НА ВАШ ИТОГОВЫЙ URL ОТ RENDER
local API_ENDPOINT = SERVER_URL .. "/api/get-command"

print("[*] Starting CC: Tweaked controller...")
print("[*] Listening for commands from: " .. SERVER_URL)

while true do
    -- Делаем GET запрос к серверу
    local response, err = http.get(API_ENDPOINT)
    
    if response then
        -- Читаем весь ответ как текст
        local body = response.readAll()
        response.close()
        
        -- Проверяем наличие команды строковым поиском, без парсинга JSON
        if string.find(body, "activate_redstone") then
            print("[!] SIGNAL RECEIVED! Activating redstone...")
            
            -- Выдаем редстоун сигнал назад
            redstone.setOutput("back", true)
            
            -- Ждем 3 секунды
            os.sleep(3)
            
            -- Выключаем редстоун
            redstone.setOutput("back", false)
            print("[*] Redstone deactivated. Waiting for next command...")
        end
    else
        print("[!] HTTP Request failed: " .. tostring(err))
    end
    
    -- Пауза в 1 секунду перед следующим опросом
    os.sleep(1)
end
