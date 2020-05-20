export declare class PrioritizedTaskExecutor {
    private maxPoolSize;
    private currentPoolSize;
    private queue;
    /**
     * Executes tasks up to maxPoolSize at a time, other items are put in a priority queue.
     * @class PrioritizedTaskExecutor
     * @private
     * @param {Number} maxPoolSize The maximum size of the pool
     * @prop {Number} maxPoolSize The maximum size of the pool
     * @prop {Number} currentPoolSize The current size of the pool
     * @prop {Array} queue The task queue
     */
    constructor(maxPoolSize: number);
    /**
     * Executes the task.
     * @private
     * @param {Number} priority The priority of the task
     * @param {Function} fn The function that accepts the callback, which must be called upon the task completion.
     */
    execute(priority: number, fn: Function): void;
    /**
     * Checks if the taskExecutor is finished.
     * @private
     * @returns {Boolean} - Returns `true` if the taskExecutor is finished, otherwise returns `false`.
     */
    finished(): boolean;
}
