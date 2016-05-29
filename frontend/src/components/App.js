import React from 'react';

const App = ({ children }) => (
  <t>
    <div className="row np-nav">
      <div className="col s12">
      </div>
    </div>

    <section className="np-body">
      {children || 'Welcome to React Starterify'}
    </section>
  </t>
);

App.propTypes = { children: React.PropTypes.object };

export default App;
