# unity3d-animator-js
A javascript replica of Unity3D Animator. notice l state a replica because obviously Unity has wayyyy more functionality built in. Also im not sure if Unity transitions from top-down or bottom-up but l wrote this to transition top-down.

# Usage


```js
	// Initailize Animator with data from Unity. Load both the *.controller and *.controller.meta
	// LoadText ( url ) should be a function that loads text
const animator = new Animator ();
await animator.load ( 
	await LoadText ( "asset/animator/player/PlayerManager.controller" ), 
	await LoadText ( "asset/animator/player/PlayerManager.controller.meta" ) );
```


Hook into the Animator transition notifications


```js
	// Retrieve StateMachine defined in controller yaml by "m_name"
const animatorState = ( _animator.query ().first ( { "m_Name" : "SelectState" } ) );

	// watch the trigger and release notifications
animatorState.subscribe ( "trigger", function ( notify, animatorComponent ) {

	console.error ( "statemachine triggered! Do Something" );

} );
animatorStateMachine.subscribe ( "release", function ( notify, animatorComponent ) {

	console.error ( "stateMachine root released! Do Something" );

} );

	// Resolve the StateMachine's root so we can check for any changes from the top level
const animatorStateMachine = animatorState.resolve ();

	 // watch the trigger and release notifications
animatorStateMachine.subscribe ( "trigger", function ( notify, animatorComponent ) {

	console.error ( "stateMachine root triggered! Do Something" );

} );
animatorStateMachine.subscribe ( "release", function ( notify, animatorComponent ) {

	console.error ( "stateMachine root released! Do Something" );

} );
```


Retrieve a parameter and change its value which will transition the StateMachine 


```js
	// change a parameter and let the Animator transition to a new state, parameter should
	// be the same type as defined in Unity. Otherwise your on your own buddy!
const selectParameter = animator.parameters ().get ( "Select" );
selectParameter.val ( true );

```


# Help me out! 

So l can open-source more code. This is just a tip of the iceberg.

[![Pay Pal Donation](http://172.105.99.59/image/paypal-qrcode.png) =200x]