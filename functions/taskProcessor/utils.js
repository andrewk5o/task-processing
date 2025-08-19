async function simulateTaskProcessing(taskId) {
    const processingTime = 1000;

    console.log(`Processing task ${taskId}... (delay: ${processingTime}ms)`);

    await new Promise(resolve => setTimeout(resolve, processingTime));

    const failureChance = Math.random();
    if (failureChance < 0.3) {
        console.log('=== TASK FAILURE SIMULATION ===');
        console.log(`Task ID: ${taskId} - Simulated failure`);
        console.log(`Random value: ${failureChance.toFixed(3)} (threshold: 0.3)`);
        console.log('=====================================');

        throw new Error(`TaskProcessingError: Task ${taskId} failed`);
    }

    console.log(`Task ${taskId} processed successfully`);
}

module.exports = {
    simulateTaskProcessing
};
