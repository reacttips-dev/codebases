import{a as i}from"./chunk-YG5VU5UW.js";import{b as p,e as m}from"./chunk-DQSCGVX4.js";import{f as a}from"./chunk-JXNVBN57.js";import{m as r}from"./chunk-4DDSFSZM.js";import{f as u,i as k}from"./chunk-ORNWO27Z.js";var o=u(k());var b=({status:n,orgId:l,trialEndAt:d,isAdmin:e})=>{let t=`/organisations/${l}/billing/plan`;return n==="trialing"?o.default.createElement(i,{type:"warning",mb:4},"You\u2019re currently on a free Trial with"," ",o.default.createElement(a,{color:"inherit"},p(m(d)))," ","left.",e?o.default.createElement(o.default.Fragment,null," ",o.default.createElement(r,{to:t},"Choose a plan now"),"."):null):n=="trial_expired"||n==="trial_canceled"?o.default.createElement(i,{type:"warning",mb:4},"Your trial has ended."," ",e?o.default.createElement(o.default.Fragment,null,o.default.createElement(r,{to:t},"Choose a plan")," to continue monitoring your Sites."):o.default.createElement(o.default.Fragment,null,"Contact a team admin to choose a plan.")):n==="past_due"?o.default.createElement(i,{type:"warning",mb:4},o.default.createElement(a,{color:"inherit"},"We couldn\u2019t process your payment.")," ",e?o.default.createElement(o.default.Fragment,null,o.default.createElement(r,{to:`/organisations/${l}/billing/payment`},"Update your payment details")," ","to avoid disruptions in monitoring."):o.default.createElement(o.default.Fragment,null,"Contact a team admin to update the billing method.")):n==="canceled"?o.default.createElement(i,{type:"warning",mb:4},"Your plan has been cancelled."," ",e?o.default.createElement(o.default.Fragment,null,o.default.createElement(r,{to:t},"Choose a plan")," to continue monitoring your Sites."):o.default.createElement(o.default.Fragment,null,"Contact a team admin to choose a plan.")):null},h=b;export{h as a};
//# sourceMappingURL=chunk-BGUAJZU5.js.map