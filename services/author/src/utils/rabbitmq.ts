import amqp from "amqplib";

// Creating a channel
let channel: amqp.Channel | null = null;

// Creating a connection
export const connectRabbitMq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
        });
        channel = await connection.createChannel();
        console.log("RabbitMQ connected successfully");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        throw error;
    }
}

export const publishToQueue = async (queue: string, message: any) => {
    if (!channel) {
        throw new Error("Channel is not initialized. Call connectRabbitMq first.");
    }
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {persistent: true});
        console.log(`Message sent to queue ${queue}:`, message);
    } catch (error) {
        console.error("Error publishing to queue:", error);
        throw error;
    }
}

export const invalidateCacheJob = async (cacheKeys: string[]) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKeys,
        };
        await publishToQueue("cache-invalidation", message);
        console.log("Cache invalidation job published:", message);
    } catch (error) {
        console.error("Error publishing cache invalidation job:", error);
        throw error;
    }
}