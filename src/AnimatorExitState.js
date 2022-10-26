require ( "animator/AbstractAnimatorComponent" );

( function ( dns ) {

	AnimatorExitState.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorExitState.prototype.constructor = AnimatorExitState;

	function AnimatorExitState () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		let _animator;

		const _animatorStateTransitionSet = new Set ();

		_this.resolve = function () {

			return _this;

		};

		_super.init = _this.init;
		_this.init = function ( animator, dataObj ) {

			_super.init ( animator, { "name" : "exit-state", "exit-state" : true } );

		};

		_this.load = async function () {

		};

		_this.frame = function ( frameData ) {

		};

		_this.trigger = function ( ...rest ) {



		};

	}

	dns.AnimatorExitState = AnimatorExitState;
	
} ( DEFAULT_NAMESPACE () ) );