"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrioritizedTaskExecutor = /** @class */ (function () {
    /**
     * Executes tasks up to maxPoolSize at a time, other items are put in a priority queue.
     * @class PrioritizedTaskExecutor
     * @private
     * @param {Number} maxPoolSize The maximum size of the pool
     * @prop {Number} maxPoolSize The maximum size of the pool
     * @prop {Number} currentPoolSize The current size of the pool
     * @prop {Array} queue The task queue
     */
    function PrioritizedTaskExecutor(maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
        this.currentPoolSize = 0;
        this.queue = [];
    }
    /**
     * Executes the task.
     * @private
     * @param {Number} priority The priority of the task
     * @param {Function} fn The function that accepts the callback, which must be called upon the task completion.
     */
    PrioritizedTaskExecutor.prototype.execute = function (priority, fn) {
        var _this = this;
        if (this.currentPoolSize < this.maxPoolSize) {
            this.currentPoolSize++;
            fn(function () {
                _this.currentPoolSize--;
                if (_this.queue.length > 0) {
                    _this.queue.sort(function (a, b) { return b.priority - a.priority; });
                    var item = _this.queue.shift();
                    _this.execute(item.priority, item.fn);
                }
            });
        }
        else {
            this.queue.push({ priority: priority, fn: fn });
        }
    };
    /**
     * Checks if the taskExecutor is finished.
     * @private
     * @returns {Boolean} - Returns `true` if the taskExecutor is finished, otherwise returns `false`.
     */
    PrioritizedTaskExecutor.prototype.finished = function () {
        return this.currentPoolSize === 0;
    };
    return PrioritizedTaskExecutor;
}());
exports.PrioritizedTaskExecutor = PrioritizedTaskExecutor;
//# sourceMappingURL=prioritizedTaskExecutor.js.map