/**
 * Simulates task processing with constant delay and 30% probability of failure
 * @param {string} taskId - The task ID to potentially fail
 * @throws {Error} Throws TaskProcessingError if task should fail
 */
async function simulateTaskProcessing(taskId) {
    // Constant processing delay of 1 second
    const processingTime = 1000;

    console.log(`Processing task ${taskId}... (delay: ${processingTime}ms)`);

    await new Promise(resolve => setTimeout(resolve, processingTime));

    const failureChance = Math.random();
    if (failureChance < 0.3) {
        console.log('=== TASK FAILURE SIMULATION ===');
        console.log(`Task ID: ${taskId} - Simulated failure`);
        console.log(`Random value: ${failureChance.toFixed(3)} (threshold: 0.3)`);
        console.log('=====================================');

        // Throw error to trigger error handling logic
        throw new Error(`TaskProcessingError: Task ${taskId} failed`);
    }

    console.log(`Task ${taskId} processed successfully`);
    // No return needed - success means no error thrown
}

module.exports = {
    simulateTaskProcessing
};
