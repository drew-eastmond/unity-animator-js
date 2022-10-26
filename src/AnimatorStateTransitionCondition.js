( function ( dns ) {
	"use strict";

	function AnimatorStateTransitionCondition () {

		const _this = this;

		let _animatorParamater;

		let _conditionMode;
		let _eventTreshold;

		_this.init = function ( animatorParamater, data ) {

			console.log ( ">animatorParamater", data );

			_animatorParamater = animatorParamater;

			_conditionMode = data.m_ConditionMode;
			_eventTreshold = data.m_EventTreshold;

			/* m_ConditionMode: 2
		    m_ConditionEvent: grounded
		    m_EventTreshold: 0 */

		};

		_this.query = function () {

			// console.log ( _conditionMode, await _animatorParamater.val () );

			switch ( _conditionMode )  {
				case 1 : // bool/trigger : true
					return ( _animatorParamater.val () === true );

				case 2 : // bool : false
					return ( _animatorParamater.val () === false );

				case 3 : // int/float : greater
					return ( _animatorParamater.val () > _eventTreshold );

				case 4 : // int/float : less
					return ( _animatorParamater.val () < _eventTreshold );

				case 6 : // int : equal
					return ( _animatorParamater.val () == _eventTreshold );

				case 7 : // int : not equal
					return ( _animatorParamater.val () != _eventTreshold );

				default :
					throw "unknown AnimatorStateTransitionCondition";

			}		

		};

	}

	dns.AnimatorStateTransitionCondition = AnimatorStateTransitionCondition;

} ( DEFAULT_NAMESPACE () ) );