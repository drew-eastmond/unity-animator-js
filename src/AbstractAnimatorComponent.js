require ( "js-lib/core/subscription/AbstractSubscription" );

( function ( dns ) {

	function Subscriber () {

		const _this = this;

		_this.init = function ( overload ) {

			if ( overload ) {
				
			}

		};

	}

	AbstractAnimatorComponent.prototype = new dns.AbstractSubscription ();
	AbstractAnimatorComponent.prototype.constructor = AbstractAnimatorComponent;
	
	function AbstractAnimatorComponent () {

		const _super = {};
		dns.AbstractSubscription.call ( this );
		const _this = this;

		let _animator;

		let _attributes;

		let _parent;

		let _triggered;

		let _weight;
		let _transitionWeight;

		const _queryMap = new Map ();

		_this.weight = function () {

			let weight = _weight;

			const queryManager = _queryMap.get ();
			const queryResults = queryManager.select ( { "weight" : true } );
			for ( let [ callback, attributes ] of queryResults ) {

				weight = weight * callback ( _this );

			}

			return weight;

		};

		_this.isTriggered = function () {

			return _triggered;

		};

		_this.hierarchy = function ( ...rest ) {

			if ( _parent ) {

				return _parent.hierarchy ( _this, ...rest );

			} else {

				return [ _this, ...rest ];

			}

		};

		_this.parent = function ( val ) {

			return ( val === undefined ) ? _parent : _parent = val;

		};

		_this.attributes = function () {

			return _attributes;

		};

		_this.animator = function () {

			return _animator;

		};

		_this.resolve = function () {

			return _this;

		};

		_this.query = function ( key ) {

			if ( !_queryMap.has ( key ) ) {

				_queryMap.set ( key, dns.PoolManager.instantiate ( dns.QueryManager ) );

			}

			return _queryMap.get ( key );

		};

		_this.init = function ( animator, attributes ) {

			_animator = animator;

			_attributes = attributes;

			_triggered = false;

		};

		

		_this.trigger = function ( ...rest ) {

			if ( _triggered === false ) {

				console.warn ( "trigger", _attributes, _this, ...rest );

				// _animator.trigger ( _this.resolve () );

				_this.notify ( "trigger", _this );

			}

			_triggered = true;

		};

		_this.release = function ( ...rest ) {

			_triggered = false;

			_this.notify ( "release", _this );

			console.warn ( "released", _this.attributes (), _this );

		};

		_this.frame = function ( frameObj ) {

			_this.notify ( "frame", _this, frameObj );

		};

	}

	dns.AbstractAnimatorComponent = AbstractAnimatorComponent;

} ( DEFAULT_NAMESPACE () ) );