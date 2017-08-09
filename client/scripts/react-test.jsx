class HelloSeparation extends React.Components {
    render() {
	return (<div>Hello from a separate file at {this.props.now}.</div>);
    }
}

reactDOM.render(<HelloSeparation now={new Date().toString()} />, document.getElementById('container-time2'));
