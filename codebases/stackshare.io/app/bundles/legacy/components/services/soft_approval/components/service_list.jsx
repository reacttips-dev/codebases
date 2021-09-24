import React from 'react';

const ServiceList = ({nonSubmittedTools, pendingApprovalTools, onServiceClick, selectedToolId}) => (
  <div>
    {nonSubmittedTools.map(tool => {
      return (
        <div
          className={
            `soft-approval-service approval_service ` +
            (tool.id === selectedToolId ? 'approval_activeService' : '')
          }
          onClick={() => {
            onServiceClick(tool);
          }}
          key={`services-${tool.id}`}
        >
          <img src="https://img.stackshare.io/fe/pending_approval.png" />
          <p>{tool.name}</p>
        </div>
      );
    })}

    {pendingApprovalTools.map(function(tool) {
      return (
        <div className={`soft-approval-service approval_service`} key={`services-${tool.id}`}>
          <img src={tool.image_url} />
          <i className="pending-approval-tool-check fa fa-check" />
          <p>{tool.name}</p>
        </div>
      );
    })}
    <div className="clearfix" />
  </div>
);

export default ServiceList;
