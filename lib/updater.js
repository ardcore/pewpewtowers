(function() {
	
	if(!window.__) {
		window.__ = {};
	}
	
	/*
	 * PROTOCOLS
	 * - UpdaterTargetProtocol
	 * @accepts_params 
	 * 	@param {float} dt - time passed per tick
	 * 	@parma {float} total_time - total time passed since Updater started or since resetTime was called  
	 */
	
	// dependency check
	if(!window.__.Scheduler) {
		//throw('Dependecy error: Scheduler not available');
	}
	
	// constants
	var DEFAULT_INTERVAL = 13;
	
	/*
	 * - Updater
	 * @constructor
	 */
	function Updater() {
		
		this.timer;
		this.interval;
		
		this.prev_time;
		this.cur_time;
		this.total_time;

		this.update_target;
		this.update_method_name;
				
	}
	
	Updater.version = "1.0.0";
	
	/*
	 * + shared
	 * static method returning singleton instance of Updater
	 * @param {function reference} update_target - adheres to UpdaterTargetProtocol
	 * @param {int} interval
	 * @param {string} selector [optional] - name of method to be called by Updater update observer - defaults to 'update'
	 */
	Updater.shared = function(update_target, interval, selector) {
		if(!Updater.shared_updater) {
			Updater.shared_updater = new Updater().init(update_target, interval, selector);
		}
		return Updater.shared_updater;
	}
	
	/*
	 * - init
	 * designated initializer, creates the timer with 
	 * setInterval and updates the passed by reference 
	 * update_target method for given interval or default 
	 * value of 13
	 * @param {function reference} update_target - adheres to UpdaterTargetProtocol
	 * @param {int} interval
	 * @param {string} selector [optional] - name of method to be called by Updater update observer - defaults to 'update'
	 */
	Updater.prototype.init = function(update_target, interval, selector) {
		
		this.interval = interval || DEFAULT_INTERVAL;
		
		this.update_target = update_target; 
		this.update_method_name = selector || 'update';
		this.total_time = 0;
		
		this.start();
		
		return this;
	}
	
	/*
	 * - update
	 * time update method which calculates the time 
	 * passed between updates and total time passed;
	 */
	Updater.prototype.update = function() {
		var dt;
		
		this.cur_time = +new Date() / 1000;
		dt = this.cur_time - this.prev_time;
		this.total_time += dt;
		
		this.update_target[this.update_method_name](dt, this.total_time);
		
		this.prev_time = this.cur_time;
		
	}
	
	/*
	 * - stop
	 * stops the updater
	 * tip: Updater starts automatically by default
	 * 		if you want to stop it at start initialize 
	 * 		it with new Updater().init().stop()
	 */
	Updater.prototype.stop = function() {
		
		clearInterval(this.timer);
		this.timer = null;
		
	}
	
	/*
	 * - start
	 * restarts the updater
	 */
	Updater.prototype.start = function() {
		
		var updater = this;
		
		if(!this.timer) {
			this.cur_time = this.prev_time = +new Date() / 1000;
			this.timer = setInterval(function() {
				updater.update();
			}, this.interval);
		}
		
	}
	
	window.__.Updater = Updater;
	
})();
