const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://api:8000';
const AUTHORIZED_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessions'
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE TO LOGIN TO WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Agent is ready!');
});

client.on('message', async (msg) => {
    // Only respond to the authorized number
    if (AUTHORIZED_NUMBER && msg.from !== `${AUTHORIZED_NUMBER}@c.us`) {
        return;
    }

    const command = msg.body.toLowerCase().trim();

    try {
        if (command === '!status') {
            const res = await axios.get(`${API_URL}/status`);
            const { engine_status, broker, active_strategies, pnl } = res.data;
            msg.reply(`📊 *OpenAlgo Status*\n\nEngine: ${engine_status.toUpperCase()}\nBroker: ${broker}\nStrategies: ${active_strategies}\nDaily PnL: ₹${pnl}`);
        }
        else if (command === '!start') {
            await axios.post(`${API_URL}/engine/start`);
            msg.reply('🚀 *Engine Started!*');
        }
        else if (command === '!stop') {
            await axios.post(`${API_URL}/engine/stop`);
            msg.reply('🛑 *Engine Stopped!*');
        }
        else if (command === '!pnl') {
            const res = await axios.get(`${API_URL}/status`);
            msg.reply(`💰 *Current PnL:* ₹${res.data.pnl}`);
        }
        else if (command === '!help') {
            msg.reply('🤖 *OpenAlgo Commands:*\n\n!status - Get system status\n!start - Start trading engine\n!stop - Stop trading engine\n!pnl - Get current PnL\n!kill - Emergency shutdown');
        }
    } catch (err) {
        console.error('Command Error:', err.message);
        msg.reply('⚠️ Error executing command. Check logs.');
    }
});

client.initialize();
