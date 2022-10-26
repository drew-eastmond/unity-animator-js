require ( "animator/AbstractAnimatorComponent" );
require ( "animator/AnimatorStateTransitionCondition" );


( function ( dns ) {
	"use strict";

	AnimatorStateTransition.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorStateTransition.prototype.constructor = AnimatorStateTransition;

	function AnimatorStateTransition () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		let _animator;

		let _destinationState;

		const _animatorStateTransitionConditionSet = new Set ();

		const _inverseTransitionWeight = function () {

			return ( 1.0 - _easing );

		};

		const _normalTransitionWeight = function () {

			return _easing;

		};

		const _notifyAnimatorParamater = function () {

			console.log ( "_notifyAnimatorParamater" );

			if ( _animator.isActive ( _this ) ) {

				_this.query ();

			}

		};

		_super.parent = _this.parent;
		_this.parent = function ( val ) {

			if ( val !== undefined ) {

				val.query ().add ( _inverseTransitionWeight, { "weight" : true } );
				
			}

			return _super.parent ( val );

		};

		_super.init = _this.init;
		_this.init = function ( animator, dataObj ) {

			_super.init ( animator, dataObj );

			_animator = animator;

			/*m_ObjectHideFlags: 1
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: 
  m_Conditions: []
  m_DstStateMachine: {fileID: 0}
  m_DstState: {fileID: -1635921023452102098}
  m_Solo: 0
  m_Mute: 0
  m_IsExit: 0
  serializedVersion: 3
  m_TransitionDuration: 0.25
  m_TransitionOffset: 0
  m_ExitTime: 0.75
  m_HasExitTime: 1
  m_HasFixedDuration: 1
  m_InterruptionSource: 0
  m_OrderedInterruption: 1
  m_CanTransitionToSelf: 1 */

		};

		_this.load = function () {

			_animator.load ()
				.then ( async function () {

					const animatorParameters = _animator.parameters ();

					const attributes = _this.attributes ();

					for ( const conditionObj of attributes.m_Conditions ) {

						const animatorParamater = animatorParameters.get ( conditionObj.m_ConditionEvent );
						animatorParamater.subscribe ( "trigger", _notifyAnimatorParamater );

						const animatorStateTransitionCondition = dns.PoolManager.instantiate ( dns.AnimatorStateTransitionCondition, animatorParamater, conditionObj );

						_animatorStateTransitionConditionSet.add ( animatorStateTransitionCondition );

					}

					_destinationState = await ( attributes.m_DstStateMachine || attributes.m_DstState );

					if ( _destinationState === undefined ) {

						console.error ( "needs exit state,. maybe build it dynamically" );

					} else {

						_destinationState.query ().add ( _normalTransitionWeight, { "weight" : true } );

					}

				} );		
			
		};

		_this.query = async function () {

			let query;

			for ( const animatorStateTransitionCondition of _animatorStateTransitionConditionSet ) {

				if ( await animatorStateTransitionCondition.query () === true ) {

					query = ( query === false ) ? false : true;

				} else {

					query = false;

				}

			}

			if ( query === true ) {

				_animator.trigger ( _destinationState );

			}

		};

		_super.frame = _this.frame;
		_this.frame = function ( frameData ) {

			_super.frame ( frameData );

			_destinationState.notify ( "frame", _destinationState, frameObj );

		};

		_super.trigger = _this.trigger;
		_this.trigger = function ( ...rest ) {

			_super.trigger ( ...rest );

			setTimeout ( function () {

				_destinationState.trigger ();

			}, 50 );

		};

	}

	dns.AnimatorStateTransition = AnimatorStateTransition;

} ( DEFAULT_NAMESPACE () ) );