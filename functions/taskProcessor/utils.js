/**
 * Simulates task processing with exponential backoff retry strategy and 30% probability of failure
 * @param {string} taskId - The task ID to potentially fail
 * @param {number} retryCount - Current retry attempt number (0 for first attempt)
 * @returns {Promise<boolean>} Promise that resolves to true if task should succeed, false if it should fail
 */
async function simulateTaskProcessing(taskId, retryCount = 0) {
    // Exponential backoff: base delay * 2^retryCount
    const baseDelay = 1000; // 1 second base delay
    const processingTime = baseDelay * Math.pow(2, retryCount);

    console.log(`Processing task ${taskId}... (retries ${retryCount}, delay: ${(processingTime / 1000).toFixed(1)}s)`);

    await new Promise(resolve => setTimeout(resolve, processingTime));

    const failureChance = Math.random();

    if (failureChance < 0.3) {
        console.log('=== TASK FAILURE SIMULATION ===');
        console.log(`Task ID: ${taskId} - Simulated failure on attempt ${retryCount + 1}`);
        console.log(`Random value: ${failureChance.toFixed(3)} (threshold: 0.3)`);
        console.log('=====================================');

        return false; // Task should fail
    }

    console.log(`Task ${taskId} processed successfully on attempt ${retryCount + 1} in ${(processingTime / 1000).toFixed(1)}s`);
    return true; // Task should succeed
}

module.exports = {
    simulateTaskProcessing
};
