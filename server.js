const express = require('express');
const cors = require('cors');

const app = express();
// Используем 3000 для совместимости с текущим окружением
// Render.com автоматически передаст свой порт через process.env.PORT (например, 10000)
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let commandsQueue = [];

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft Controller</title>
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .btn {
            background-color: #8b0000;
            color: white;
            border: 2px solid #5c0000;
            padding: 20px 40px;
            font-size: 24px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255,0,0,0.2);
        }
        .btn:hover {
            background-color: #ff0000;
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255,0,0,0.4);
        }
        .btn:active {
            transform: scale(0.95);
        }
        #status {
            margin-top: 20px;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <button class="btn" onclick="sendCommand()">Включить Редстоун 🔴</button>
    <div id="status">Ожидание команды...</div>

    <script>
        function sendCommand() {
            const statusEl = document.getElementById('status');
            statusEl.textContent = 'Отправка...';
            
            fetch('/api/send-command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command: 'activate_redstone' })
            })
            .then(res => res.json())
            .then(data => {
                statusEl.textContent = 'Сигнал отправлен в очередь!';
                setTimeout(() => statusEl.textContent = 'Ожидание команды...', 2000);
            })
            .catch(err => {
                statusEl.textContent = 'Ошибка отправки!';
                console.error('Ошибка:', err);
            });
        }
    </script>
</body>
</html>
    `);
});

app.post('/api/send-command', (req, res) => {
    const { command } = req.body;
    if (command) {
        commandsQueue.push(command);
        console.log(`[!] Команда получена с сайта и добавлена в очередь: ${command}`);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'No command' });
    }
});

app.get('/api/get-command', (req, res) => {
    if (commandsQueue.length > 0) {
        const command = commandsQueue.shift();
        res.json({ command: command });
    } else {
        res.json({ command: null });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});
