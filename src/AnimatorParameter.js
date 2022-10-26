require ( "animator/AbstractAnimatorComponent" );

( function ( dns ) {
	"use strict";

	AnimatorParameter.prototype = new dns.AbstractAnimatorComponent ();
	AnimatorParameter.prototype.constructor = AnimatorParameter;

	function AnimatorParameter () {

		const _super = {};
		dns.AbstractAnimatorComponent.call ( this );
		const _this = this;

		let _value;

		let _type;

		_this.val = function ( val ) {

			if ( val === undefined ) {

				return _value;

			} else {

				_value = val;
				_this.notify ( "trigger", _this );

			}

			return _value;

		};

		_super.init = _this.init;
		_this.init = function ( animator, data ) {

			_super.init ( animator, data );

			console.log ( "AnimatorParameter", data );

			let attributes = _this.attributes ();

			_type = attributes.m_Type;

			switch ( _type ) {
				case 1 : // float
					_value = attributes.m_DefaultFloat;
					break;
				case 3 : // int
					_value = attributes.m_DefaultInt;
					break;
				case 4 : // boolean
					_value = ( attributes.m_DefaultBool == 0 ) ? false : true;
					break;
				case 9 : // trigger
					_value = false;
					break;

			}

			/*- m_Name: grounded
    m_Type: 4
    m_DefaultFloat: 0
    m_DefaultInt: 0
    m_DefaultBool: 0
    m_Controller: {fileID: 0}

    */

		};

	}

	dns.AnimatorParameter = AnimatorParameter;

} ( DEFAULT_NAMESPACE () ) );