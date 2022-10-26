require ( "animator/AbstractAnimatorComponent" );

( function ( dns ) {

	AnimatorState.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorState.prototype.constructor = AnimatorState;

	function AnimatorState () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		let _animator;



		const _animatorStateTransitionSet = new Set ();

		_this.query

		_this.resolve = function () {

			return _this;

		};

		_super.init = _this.init;
		_this.init = function ( animator, dataObj ) {

			_super.init ( animator, dataObj );

			_animator = animator;

			_animatorStateTransitionSet.clear ();

		};

		_this.load = async function () {

			let attributes = _this.attributes ();

			for ( let animatorStateTransition of attributes.m_Transitions ) {

				animatorStateTransition = await animatorStateTransition;

				animatorStateTransition.parent ( _this );

				_animatorStateTransitionSet.add ( animatorStateTransition );

			}

		};

		/* _super.frame = _this.frame;
		_this.frame = function ( frameObj ) {

			_super.frame ( frameObj );

			if ( _animator.isActive ( _this ) ) {

				for ( let animatorStateTransition of _animatorStateTransitionSet ) {

					animatorStateTransition.query ( frameObj );

				}

				_this.parent ().frame ( frameObj );

			}

		}; */

	}

	dns.AnimatorState = AnimatorState;
	
} ( DEFAULT_NAMESPACE () ) );