require ( "animator/AbstractAnimatorComponent" );
require ( "animator/AnimatorParameter" );

( function ( dns ) {
	"use strict";

	AnimatorController.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorController.prototype.constructor = AnimatorController;

	function AnimatorController () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		const _currentStateMap = new Map ();

		const _parameterMap = new Map ();

		_this.parameters = function () {

			return _parameterMap;

		};

		_this.resolve = function () {

			const results = new Set ();

			for ( const [ key, animatorState ] of _currentStateMap ) {

				results.add ( animatorState );

			}

			return results;

		};

		_this.hierarchy = function ( ...rest ) {

			return [ ...rest ];

		};

		_this.isActive = function ( animatorComponent ) {

			// console.log ( "_this.isActive " );

			let hierarchy = animatorComponent.hierarchy ();

			const animatorStateMachine = hierarchy [ hierarchy.length - 1 ];

			if ( animatorStateMachine ) {

				let currentState = animatorStateMachine.resolve ();

				let test = currentState.hierarchy ();

				// console.log ( "test", test, test [ 0 ].attributes () );

				if ( test.indexOf ( animatorComponent ) > -1 ) {

					return true;

				}

			}

			return false;

		};

		_super.init = _this.init;
		_this.init = function ( animator, dataObj ) {

			_super.init ( animator, dataObj );

			let attributes = _this.attributes ();
			
			for ( let parameterData of attributes.m_AnimatorParameters ) {

				let animatorParameter = dns.PoolManager.instantiate ( dns.AnimatorParameter, animator, parameterData );

				_parameterMap.set ( parameterData.m_Name, animatorParameter );


			}

		};

		_this.load = async function () {

			let attributes = _this.attributes ();

			let i = 0; 
			for ( let layerData of attributes.m_AnimatorLayers ) {

				const animatorStateMachine = await layerData.m_StateMachine;
				animatorStateMachine.parent ( _this );

				animatorStateMachine.layerData ( layerData );

					// trigger this to start
				const currentState = animatorStateMachine.resolve ();
				console.warn ( "Start state", currentState.attributes (), currentState.hierarchy () );

				_currentStateMap.set ( animatorStateMachine, currentState );
			}

		};

		_this.frame = function ( frameObj ) {

			for ( const [ key, animatorParameter ] of _parameterMap ) {

				animatorParameter.frame ( frameObj );

			}

			for ( const [ rootState, currentState ] of _currentStateMap ) {

				let heiracrchy = currentState.resolve ().hierarchy ();

				let animatorState;
				while ( heiracrchy.length ) {

					animatorState = heiracrchy.pop ();
					animatorState.frame ( frameObj );

				}

			}

		};

		_this.trigger = function ( animatorComponent ) {

			let currentState = animatorComponent.resolve ();

			let triggerHierarchy = currentState.hierarchy ();

			let rootState = triggerHierarchy [ 0 ];

			let previousState = _currentStateMap.get ( rootState );

			console.log ( "triggerHierarchy", triggerHierarchy, currentState.attributes () );

			if ( previousState ) {

				const previousHierarchy = previousState.hierarchy ();

				console.log ( "previousHierarchy", previousHierarchy );

				for ( const animatorComponent of previousHierarchy ) {

					if ( triggerHierarchy.indexOf ( animatorComponent ) == -1 ) {

						animatorComponent.release ();

					}

				}

				_currentStateMap.set ( rootState, currentState );
				for ( let animatorComponent of triggerHierarchy ) {

					animatorComponent.trigger ();

				}

			}

		};

	}

	dns.AnimatorController = AnimatorController;

} ( DEFAULT_NAMESPACE () ) );

/*


  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: Export-Ani
  serializedVersion: 5
  m_AnimatorParameters:
  - m_Name: grounded
    m_Type: 4
    m_DefaultFloat: 0
    m_DefaultInt: 0
    m_DefaultBool: 0
    m_Controller: {fileID: 0}
  m_AnimatorLayers:
  - serializedVersion: 5
    m_Name: Base Layer
    m_StateMachine: {fileID: 3047463803745721800}
    m_Mask: {fileID: 0}
    m_Motions: []
    m_Behaviours: []
    m_BlendingMode: 0
    m_SyncedLayerIndex: -1
    m_DefaultWeight: 0
    m_IKPass: 0
    m_SyncedLayerAffectsTiming: 0
    m_Controller: {fileID: 9100000} */