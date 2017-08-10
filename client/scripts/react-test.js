// class HelloSeparation extends React.Component {
//     render() {
// 	return (<div>Hello from a separate file at {this.props.now}.</div>);
//     }
// }

// reactDOM.render(<HelloSeparation now={new Date().toString()} />, document.getElementById('container-time2'));

var Hello = React.createClass({
    render: function (){
	return (<div>Hello from a new file at {this.props.now}</div>);
    } 
});

ReactDOM.render(<Hello now={new Date().toString()}/>, document.getElementById('container-time2'));
