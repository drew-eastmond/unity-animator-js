require ( "animator/AbstractAnimatorComponent" );

( function ( dns ) {
	"use strict";

	AnimatorStateMachine.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorStateMachine.prototype.constructor = AnimatorStateMachine;

	function AnimatorStateMachine () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		let _controller;

		let _layerData;

		let _animator; 

		let _currentState;
		let _defaultState;

		const _childStateSet = new Set ();
		const _childStateMachineSet = new Set ();
  

		_this.layerData = function ( val ) {

			_layerData = val;

			_controller = _layerData.m_Controller;

		};

		_this.resolve = function () {

			return _currentState.resolve ();

		};

		_super.init = _this.init;
		_this.init = function ( animator, dataObj ) {

			_super.init ( animator, dataObj );
			
			_animator = animator;

						/*
			serializedVersion: 6
			  m_ObjectHideFlags: 1
			  m_CorrespondingSourceObject: {fileID: 0}
			  m_PrefabInstance: {fileID: 0}
			  m_PrefabAsset: {fileID: 0}
			  m_Name: Motion StateMachine
			  m_ChildStates:
			  - serializedVersion: 1
			    m_State: {fileID: -4124801845057349141}
			    m_Position: {x: 300, y: 50, z: 0}
			  - serializedVersion: 1
			    m_State: {fileID: 1435753831049129228}
			    m_Position: {x: 300, y: 140, z: 0}
			  - serializedVersion: 1
			    m_State: {fileID: -1635921023452102098}
			    m_Position: {x: 300, y: 230, z: 0}
			  m_ChildStateMachines:
			  - serializedVersion: 1
			    m_StateMachine: {fileID: 1379516813503957667}
			    m_Position: {x: 550, y: 140, z: 0}
			  m_AnyStateTransitions: []
			  m_EntryTransitions: []
			  m_StateMachineTransitions: {}
			  m_StateMachineBehaviours: []
			  m_AnyStatePosition: {x: 50, y: 20, z: 0}
			  m_EntryPosition: {x: 50, y: 120, z: 0}
			  m_ExitPosition: {x: 800, y: 120, z: 0}
			  m_ParentStateMachinePosition: {x: 800, y: 20, z: 0}
			  m_DefaultState: {fileID: -4124801845057349141}
		    

		     serializedVersion: 6
  m_ObjectHideFlags: 1
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: Input StateMachine
  m_ChildStates:
  - serializedVersion: 1
    m_State: {fileID: 8194851656682576764}
    m_Position: {x: 360, y: 130, z: 0}
  m_ChildStateMachines: []
  m_AnyStateTransitions: []
  m_EntryTransitions:
  - {fileID: 7213291251592995152}
  m_StateMachineTransitions: {}
  m_StateMachineBehaviours: []
  m_AnyStatePosition: {x: 50, y: 20, z: 0}
  m_EntryPosition: {x: 50, y: 120, z: 0}
  m_ExitPosition: {x: 800, y: 120, z: 0}
  m_ParentStateMachinePosition: {x: 310, y: -10, z: 0}
  m_DefaultState: {fileID: 8194851656682576764}
  */

		};

		_this.load = async function () {

			let attributes = _this.attributes ();

			for ( let animatorStateObj of attributes.m_ChildStates ) {

				const animatorState = await animatorStateObj.m_State;
				animatorState.parent ( _this );

				_childStateSet.add ( animatorState );
			}


			for ( let animatorStateMachineObj of attributes.m_ChildStateMachines ) {

				const animatorStateMachine = await animatorStateMachineObj.m_StateMachine;
				animatorStateMachine.parent ( _this );

				_childStateMachineSet.add ( animatorStateMachine );

			}


			for ( const promise of attributes.m_EntryTransitions ) {

				let animatorStateTransition = await promise;

				animatorStateTransition.parent ( _this );

				// _childStateMachineSet.add ( animatorStateMachine );

			}

			_defaultState = await attributes.m_DefaultState;
			_currentState = _defaultState;

		};

		/* _super.trigger = _this.trigger;
		_this.trigger = function (  ...rest ) {

			_super.trigger (  ...rest );

		}; */

		/* _super.frame = _this.frame;
		_this.frame = function ( frameObj ) {

			_super.frame ( frameObj );

			if ( _animator.isActive ( _this ) ) {

				let parent = _this.parent ();

				if ( !( parent instanceof dns.AnimatorController ) ) {

					parent.frame ( frameObj );

				}
				

			}

		}; */

	}

	dns.AnimatorStateMachine = AnimatorStateMachine;

} ( DEFAULT_NAMESPACE () ) );