require ( "animator/AnimatorState" );
require ( "animator/AnimatorStateMachine" );
require ( "animator/AnimatorStateTransition" );
require ( "animator/AnimatorController" );
require ( "animator/AnimatorExitState" );
require ( "animator/AnimatorTransition" );



( function ( dns ) {
	"use strict";

	function AnimatorParser () {

		const _this = this;

		const lineRegExp = /(\s+)(- )?(\w+):(.*)/g;

		let _parseStack;
		let _startComponent;

		let _animator;

		let _readyPromise;

		const _resourceMap = new Map ();

		function ObjectState ( indent ) {

			this.indent = indent;

			let _val = {};

			this.val = function () {

				return _val;

			};
			
			this.consume = function ( key, val ) {

				// _val [ key ] = val;

				if ( val instanceof Promise && false ) {

					_val [ key ] = val;

					val
						.then ( function ( resolve ) {

							_val [ key ] = resolve;

						} );
					

				} else {

					_val [ key ] = val;

				}

			};
		
		};

		function ArrayState ( indent ) {

			let _val = [];

			this.indent = indent;

			this.val = function () {

				return _val;

			};

			this.next = function () {

				_val.push ( {} );

			};

			this.consume = function ( key, val ) {

				/* if ( key === undefined ) {

					_val.push ( val );

				} else {

					_val [ _val.length - 1 ] [ key ] = val;

				} */

				if ( val instanceof Promise && false ) {

					val
						.then ( function ( resolve ) {

							if ( key === undefined ) {

								_val.push ( resolve );

							} else {

								_val [ _val.length - 1 ] [ key ] = resolve;

							}

						} );
					

				} else {

					if ( key === undefined ) {

						_val.push ( val );

					} else {

						_val [ _val.length - 1 ] [ key ] = val;

					}

					

				}

			};

		};

		function _currentState () {

			return _parseStack [ _parseStack.length - 1 ];

		}

		function _parseBlock ( input ) {

			_parseStack = [ new ObjectState ( 2 ) ];

			let cursor = 0;
			const inputLines = input.split ( /\n/ );

			if ( inputLines [ inputLines.length - 1 ] == "" ) {

				inputLines.pop ();

			}

			while ( cursor < inputLines.length ) {

				const input = inputLines [ cursor ];

				let result, indent, key, val;
				if ( result = /( +)(- )?([\w]+):(.*)/.exec ( input ) ) {

					indent = result [ 1 ].length + ( ( result [ 2 ] == "- " ) ? 2 : 0 );
					key = result [ 3 ];
					val = _parseValue ( result [ 4 ].substr ( 1 ) );

				} else if ( result = /( +)(- )({.+?})/.exec ( input ) ) {

					indent = result [ 1 ].length + ( ( result [ 2 ] == "- " ) ? 2 : 0 );
					// key = result [ 3 ];
					val = _parseValue ( result [ 3 ] );

					_currentState ().consume ( undefined, val );

					cursor++;
					continue;

				} else {

					throw "wtf";

				}

				

				if ( result [ 2 ] == "- " ) {

					_currentState ().next ();

				} else if ( indent < _currentState ().indent ) {

					_parseStack.pop ();

				}

				// console.log ( input );

				if ( /^( +)([\w{]+):$/.test ( input ) && ( /^( +)- ([\w]+):(.*)/.test ( inputLines [ cursor + 1 ] ) || /( +)(- )({.+?})/.test ( inputLines [ cursor + 1 ] ) ) ) {

					let arrayState = new ArrayState ( indent + 2 );

					let previousState = _currentState ();
					previousState.consume ( key, arrayState.val () );

					_parseStack.push ( arrayState );	

				} else {

					_currentState ().consume ( key, val );

				}

				cursor++;

			}

			return _parseStack [ 0 ].val ();

		}

		function _parseValue ( val ) {

			if ( /^[0-9]+$/.test ( val ) == true ) {

				return parseInt ( val );

			} else if ( /^-?[0-9][0-9,\.]+$/.test ( val ) ) {

				return parseFloat ( val );

			} else if ( val == "[]" ) {

				return [];

			} else if ( val == "{}" ) {

				return {};

			} else if ( /\{fileID: (.+)\}/.test ( val ) ) {

				let result = /\{fileID: (.+)\}/.exec ( val );
				let resourceToken = result [ 1 ];

				if ( resourceToken === "0" ) {

					return undefined;

				} 

				// console.warn ( "ref", resourceToken );

				return _resourceMap.get ( resourceToken ) || _resourceMap.set ( resourceToken, dns.Promise () ).get ( resourceToken )

			} else if ( /\{.+\}/.test ( val ) )  {

				let correctJson = val.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
				return JSON.parse ( correctJson );

			} else {

				return val;

			}

		}

		_this.ready = function () {

			return Promise.all ( [ _readyPromise ] )
				.then ( async function () {

					return [ _resourceMap, await _startComponent ];

				} );

		};

		_this.init = function ( animator ) {

			_animator = animator;

			_readyPromise = dns.Promise ();

		};

		_this.load = async function ( input, meta ) {

			let loadedPromise = dns.Promise ();

				// parse the animator-controller file
			const regExp = /--- \!\u!(\d+)\s?&(-?\d+)\n(.+?):\n(((?!---).|\n+)+)/gm;
			let result;
			while ( result = regExp.exec ( input ) ) {

				console.log ( result [ 3 ], result [ 2 ] );
				console.log ( result [ 4 ] );
				let token = result [ 2 ];
				let constructorClass = result [ 3 ];
				let controllerBlock = result [ 4 ];

				let animatorObj = _parseBlock ( controllerBlock );

				console.log ( " " );
				console.log ( "animatorObj", animatorObj );
				console.log ( " " );

				let animatorComponent;
				switch ( constructorClass ) {
					case "AnimatorState" :
						animatorComponent = dns.PoolManager.instantiate ( dns.AnimatorState, _animator, animatorObj );
						break;
					case "AnimatorStateMachine" :
						animatorComponent = dns.PoolManager.instantiate ( dns.AnimatorStateMachine, _animator, animatorObj );
						break;
					case "AnimatorStateTransition" : 
					case "AnimatorTransition" :
						animatorComponent = dns.PoolManager.instantiate ( dns.AnimatorStateTransition, _animator, animatorObj );
						break;
					case "AnimatorController" : 
						animatorComponent = dns.PoolManager.instantiate ( dns.AnimatorController, _animator, animatorObj );
						break;
					
						//animatorComponent = dns.PoolManager.instantiate ( dns.AnimatorTransition, _animator, animatorObj );
						//break;
					default :
						console.log ( "unknown Class", constructorClass );
						// throw "unknown Class " + constructorClass;
						continue;
				}

				let promise = _resourceMap.get ( token ) || _resourceMap.set ( token, dns.Promise () ).get ( token );
				promise.resolve ( animatorComponent );

			}

							
			Promise.all ( Array.from ( _resourceMap.values () ) )
				.then ( async function ( animatorComponent ) {

					for ( const [ key, promise ] of _resourceMap ) {

						let animatorComponent = await promise;

						await animatorComponent.load ();

					}

				} )
				.then ( function () {

					_readyPromise.resolve ();

				} );


				// it a bit cheating but simple
			result = /mainObjectFileID: (.+)/.exec ( meta );
			let startToken = result [ 1 ];

			_startComponent = _resourceMap.get ( startToken ) || _resourceMap.set ( startToken, dns.Promise () ).get ( startToken );

		};

	}

	dns.AnimatorParser = AnimatorParser;

} ( DEFAULT_NAMESPACE () ) );