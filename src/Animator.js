require ( "animator/AnimatorState" );
require ( "animator/AnimatorStateMachine" );
require ( "animator/AnimatorStateTransition" );
require ( "animator/AnimatorParser" );

( function ( dns ) {
	"use strict";

	Animator.prototype = new dns.AbstractSubscription ();
	Animator.prototype.constructor = Animator;

	function Animator () {

		const _super = {};
		dns.AbstractSubscription.call ( this );
		const _this = this;

		let _animatorController;

		let _animatorParameters;

		let _loadPromise;

		let _readyPromise;

		const _queryManager = dns.PoolManager.instantiate ( dns.QueryManager );
		_this [ Symbol.iterator ] = _queryManager [ Symbol.iterator ];

		_this.parameters = function () {

			return _animatorParameters;

		};

		_this.isActive = function ( animatorComponent ) {

			return _animatorController.isActive ( animatorComponent );

		};

		_this.query = function () {

			return _queryManager;

		};

		_this.layers = function () {

			return _animatorController.layers ();

		};

		_this.resolve = function () {

			return _animatorController.resolve ();

		};

		_this.ready = function () {

			return _readyPromise;

		};

		_super.init = _this.init;
		_this.init = function () {

			_super.init ();

			_readyPromise = dns.Promise ();

			_loadPromise = dns.Promise ();
			_loadPromise
				.then ( async function ( resolves ) {

					const [ dataObj, metaObj ] = resolves;

						// parse the animator-controller file
					let animatorParser = dns.PoolManager.instantiate ( dns.AnimatorParser, _this );
					animatorParser.load ( dataObj, metaObj );
					
					const [ resourceMap, startComponent ] = await animatorParser.ready ();

					for ( const [ key, val ] of resourceMap ) {

						let component = await val; 
						component.subscribe ( "trigger", function ( notify, animatorComponent ) {

							_this.notify ( "trigger", animatorComponent );

						} );
						component.subscribe ( "frame", function ( notify, animatorComponent ) {

							_this.notify ( "frame", animatorComponent );

						} );
						component.subscribe ( "release", function ( notify, animatorComponent ) {

							_this.notify ( "release", animatorComponent );

						} );

						_queryManager.add ( component, component.attributes );

					}

					_animatorController = startComponent; // resourceMap.get ( "9100000" ); //await _queryManager.first ( { "m_Name" : "Base Layer" } );

					_animatorParameters = _animatorController.parameters ();

					for ( let [ key, animatorParameter ] of _animatorParameters ) {

						_queryManager.add ( animatorParameter, animatorParameter.attributes );

					}

					for ( const animatorComponent of _animatorController.resolve () ) {

						_animatorController.trigger ( animatorComponent );

					}

					
					_readyPromise.resolve ( _this );

				} );

		};

		_this.load = async function ( dataObj, metaObj ) {

			_loadPromise.resolve ( [ dataObj, metaObj ] );

			return _readyPromise;

		};

		_this.trigger = function ( animatorComponent ) {

			_animatorController.trigger ( animatorComponent );

		};

		_this.frame = function ( frameObj ) {

			_animatorController && _animatorController.frame ( frameObj );

		};

	}

	dns.Animator = Animator;

} ( DEFAULT_NAMESPACE () ) );