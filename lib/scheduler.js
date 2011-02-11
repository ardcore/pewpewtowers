(function() {
	
	if(!window.__) {
		window.__ = {};
	}
	
	/*
	 * PROTOCOLS
	 * - SchedulerUpdateTargetProtocol
	 * @accepts_params 
	 * 	@param {float} dt - time passed per tick
	 * 	@parma {float} entity_lifetime - total time passed since added to scheduler 
	 * 
	 * - SchedulerUpdateConditionProtocol
	 * @accepts_params 
	 * 	@param {float} dt - time passed per tick
	 * 	@parma {float} entity_lifetime - total time passed since added to scheduler 
	 * 
	 * - UpdaterTargetProtocol
	 * @accepts_params 
	 * 	@param {float} dt - time passed per tick
	 * 	@parma {float} total_time - total time passed since Updater started or since resetTime was called  
	 */
	
	/*
	 * - Scheduler
	 * @constructor
	 */
	function Scheduler() {
		
	}
	
	Scheduler.version = "0.1.2";
	
	/*
	 * + shared
	 * static method returning singleton instance of Scheduler
	 */
	Scheduler.shared = function() {
		if(!Scheduler.shared_scheduler) {
			Scheduler.shared_scheduler = new Scheduler().init();
		}
		return Scheduler.shared_scheduler;
	}
	
	/*
	 * - init
	 * designated initializer
	 */
	Scheduler.prototype.init = function() {
		
		this.updates_list = [];
		this.priority_list = [];
		this.tags = {};
		
		return this;
		
	}
	
	/*
	 * - __designatedScheduleUpdate
	 * designated scheduleUpdate method which handles all cases to avoid repetition in code
	 * can but shouldn't be used
	 */
	Scheduler.prototype.__designatedScheduleUpdate = function(target, interval, condition, tag, priority) {
		var selector;
		
		if (target.length == 2) {
			selector = target[1];
			target = target[0];
		} else {
			selector = 'update';
		}
		
		this.updates_list.push(new SchedulerTarget(target, selector, interval, condition, tag, priority));
	}
	
	/*
	 * - scheduleUpdate
	 * schedules an update every update tick 
	 * @param {mixed} target - update target method adheres to SchedulerUpdateTargetProtocol
	 * 		Object reference with default named 'update' method 
	 * 		or array with object reference and selector name for the update method - ex. [object, 'aiUpdate']    
	 * @param {string} tag [optional]
	 * @param {int} priority [optional]
	 */
	Scheduler.prototype.scheduleUpdate = function(target, tag, priority) {
		this.__designatedScheduleUpdate(target, null, null, tag, priority);
	}
	
	/*
	 * - schedulePeriodicUpdate
	 * schedules an update every n seconds
	 * @param {mixed} target - update target method adheres to SchedulerUpdateTargetProtocol
	 * 		Object reference with default named 'update' method 
	 * 		or array with object reference and selector name for the update method - ex. [object, 'aiUpdate']  
	 * @param {float} interval (in seconds)
	 * @param {string} tag [optional]
	 * @param {int} priority [optional]
	 */
	Scheduler.prototype.schedulePeriodicUpdate = function(target, interval, tag, priority) {
		this.__designatedScheduleUpdate(target, interval, null, tag, priority);
	}
	
	/*
	 * - schedulePeriodicUpdate
	 * schedules an update every n seconds
	 * @param {function ref} target - adheres to SchedulerUpdateTargetProtocol
	 * 		Object reference with default named 'update' method 
	 * 		or array with object reference and selector name for the update method - ex. [object, 'aiUpdate']  
	 * @param {function} condition - function adheres to SchedulerUpdateConditionProtocol rules
	 * @param {string} tag [optional]
	 * @param {int} priority [optional]
	 */
	Scheduler.prototype.scheduleConditionedUpdate = function(target, condition, tag, priority) {
		this.__designatedScheduleUpdate(target, null, condition, tag, priority);
	}
	
	/*
	 * - update
	 * adheres to UpdaterTargetProtocol
	 * @param {float} dt - time passed since last tick
	 * @param {float} total_time - total time passed since Updater started
	 */
	Scheduler.prototype.update = function(dt, total_time) {
		
		for (var i = 0, n = this.updates_list.length; i < n; i++) {
			this.updates_list[i].update(dt, total_time);
		}
	}
	
	/*
	 * - removeAllUpdates
	 * permanently removes all updates from the queue
	 */
	Scheduler.prototype.removeAllUpates = function() {
		
	}
	
	/*
	 * - SchedulerTarget
	 * SchedulerTarget structure handlign single scheduled object updating, 
	 * calculating objects life time and handling condtional and periodic updates
	 */
	function SchedulerTarget(target, selector, interval, condition, tag, priority){
		this.target = target;
		this.selector = selector;
		this.interval = interval;
		this.interval_time = 0;
		this.elapsed_time = 0;
		this.condition = condition;
		this.tag = tag;
		this.priority = priority;
	}
	
	SchedulerTarget.prototype.update = function(dt, total_time) {
		
		if (this.interval) {
			
			this.interval_time += dt;
				
			if (this.interval_time > this.interval) {
				
				this.elapsed_time += this.interval;
				this.interval_time -= this.interval;
				
				this.target[this.selector](this.interval, this.elapsed_time);
				
			}
			
			return;
		}
		
		if (this.condition) {
			
			this.elapsed_time += dt;
			this.interval_time += dt;
			
			if(this.condition(dt, this.elapsed_time)) {
				this.target[this.selector](this.interval_time, this.elapsed_time);
				this.interval_time = 0;
			}
			
			return;
			
		}
		
		this.elapsed_time += dt;
		this.target.update(dt, this.elapsed_time);
		
	}
	
	window.__.Scheduler = Scheduler;
	
})();