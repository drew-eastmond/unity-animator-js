require ( "animator/AbstractAnimatorComponent" );

( function ( dns ) {
	"use strict";

	AnimatorTransition.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorTransition.prototype.constructor = AnimatorTransition;

	function AnimatorTransition () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		_this.resolve = function () {

			throw "please dont be here";

		};

		_this.load = function () {

		};

	}

	dns.AnimatorTransition = AnimatorTransition;

} ( DEFAULT_NAMESPACE () ) );