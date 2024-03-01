/*

{
  "id": "WH-1EB18766R47767245-3J644022NM989091D",
  "event_version": "1.0",
  "create_time": "2021-05-19T00:37:12.142Z",
  "resource_type": "subscription",
  "resource_version": "2.0",
  "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
  "summary": "Subscription activated",
  "resource": {
    "quantity": "1",
    "subscriber": {
      "name": { "given_name": "John", "surname": "Doe" },
      "email_address": "sb-tv9k475020577@personal.example.com",
      "payer_id": "76G5FYZ8TBNHL",
      "shipping_address": {
        "address": {
          "address_line_1": "ESpachstr. 1",
          "admin_area_2": "Freiburg",
          "admin_area_1": "Baden-Württemberg",
          "postal_code": "79111",
          "country_code": "DE"
        }
      }
    },
    "create_time": "2021-05-19T00:36:48Z",
    "plan_overridden": false,
    "shipping_amount": { "currency_code": "USD", "value": "0.0" },
    "start_time": "2021-05-19T00:35:25Z",
    "update_time": "2021-05-19T00:36:50Z",
    "billing_info": {
      "outstanding_balance": { "currency_code": "USD", "value": "0.0" },
      "cycle_executions": [ {
        "tenure_type": "REGULAR",
        "sequence": 1,
        "cycles_completed": 1,
        "cycles_remaining": 0,
        "current_pricing_scheme_version": 1,
        "total_cycles": 0
      } ],
      "last_payment": { "amount": { "currency_code": "USD", "value": "100.0" }, "time": "2021-05-19T00:36:49Z" },
      "next_billing_time": "2021-06-19T10:00:00Z",
      "failed_payments_count": 0
    },
    "links": [ {
      "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/cancel",
      "rel": "cancel",
      "method": "POST",
      "encType": "application/json"
    }, {
      "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD",
      "rel": "edit",
      "method": "PATCH",
      "encType": "application/json"
    }, {
      "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    }, {
      "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/suspend",
      "rel": "suspend",
      "method": "POST",
      "encType": "application/json"
    }, {
      "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/capture",
      "rel": "capture",
      "method": "POST",
      "encType": "application/json"
    } ],
    "id": "I-E27EVWPC60XD",
    "plan_id": "P-29P74184YY2575448MBXDWAA",
    "status": "ACTIVE",
    "status_update_time": "2021-05-19T00:36:50Z"
  },
  "links": [ {
    "href": "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-1EB18766R47767245-3J644022NM989091D",
    "rel": "self",
    "method": "GET"
  }, {
    "href": "https://api.sand...ks-events/WH-1EB18766R47767245-3J644022NM989091D/resend",
    "rel": "resend",
    "method": "POST"
  } ]
};

 {
  'id': 'WH-1EB18766R47767245-3J644022NM989091D',
  'event_version': '1.0',
  'create_time': '2021-05-19T00:37:12.142Z',
  'resource_type': 'subscription',
  'resource_version': '2.0',
  'event_type': 'BILLING.SUBSCRIPTION.ACTIVATED',
  'summary': 'Subscription activated',
  'resource': {
    'quantity': '1',
    'subscriber': {
      'name': { 'given_name': 'John', 'surname': 'Doe', },
      'email_address': 'sb-tv9k475020577@personal.example.com',
      'payer_id': '76G5FYZ8TBNHL',
      'shipping_address': {
        'address': {
          'address_line_1': 'ESpachstr. 1',
          'admin_area_2': 'Freiburg',
          'admin_area_1': 'Baden-Württemberg',
          'postal_code': '79111',
          'country_code': 'DE',
        },
      },
    },
    'create_time': '2021-05-19T00:36:48Z',
    'plan_overridden': false,
    'shipping_amount': { 'currency_code': 'USD', 'value': '0.0', },
    'start_time': '2021-05-19T00:35:25Z',
    'update_time': '2021-05-19T00:36:50Z',
    'billing_info': {
      'outstanding_balance': { 'currency_code': 'USD', 'value': '0.0', },
      'cycle_executions': [ {
        'tenure_type': 'REGULAR',
        'sequence': 1,
        'cycles_completed': 1,
        'cycles_remaining': 0,
        'current_pricing_scheme_version': 1,
        'total_cycles': 0,
      }, ],
      'last_payment': { 'amount': { 'currency_code': 'USD', 'value': '100.0', }, 'time': '2021-05-19T00:36:49Z', },
      'next_billing_time': '2021-06-19T10:00:00Z',
      'failed_payments_count': 0,
    },
    'links': [ {
      'href': 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/cancel',
      'rel': 'cancel',
      'method': 'POST',
      'encType': 'application/json',
    }, {
      'href': 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD',
      'rel': 'edit',
      'method': 'PATCH',
      'encType': 'application/json',
    }, {
      'href': 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD',
      'rel': 'self',
      'method': 'GET',
      'encType': 'application/json',
    }, {
      'href': 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/suspend',
      'rel': 'suspend',
      'method': 'POST',
      'encType': 'application/json',
    }, {
      'href': 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-E27EVWPC60XD/capture',
      'rel': 'capture',
      'method': 'POST',
      'encType': 'application/json',
    }, ],
    'id': 'I-E27EVWPC60XD',
    'plan_id': 'P-29P74184YY2575448MBXDWAA',
    'status': 'ACTIVE',
    'status_update_time': '2021-05-19T00:36:50Z',
  },
  'links': [ {
    'href': 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-1EB18766R47767245-3J644022NM989091D',
    'rel': 'self',
    'method': 'GET',
  }, {
    'href': 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-1EB...7245-3...4022NM989091D/resend',
    'rel': 'resend',
    'method': 'POST',
  }, ],
};

*/

export interface IPaypalSubscription {
  id?: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version: string;
  event_type: string;
  summary: string;
  resource: {
    id: string;
    custom_id?: string;
    custom?: string;
    plan_id?: string;
    billing_agreement_id?: string;
    status?: string;
    status_update_time?: string;

    quantity?: string;
    subscriber?: {
      name?: {
        given_name?: string;
        surname?: string;
      };
      email_address?: string;
      payer_id?: string;
      shipping_address: {
        address: {
          address_line_1?: string;
          admin_area_2?: string;
          admin_area_1?: string;
          postal_code?: string;
          country_code?: string;
        };
      };
    };
    create_time?: string;
    plan_overridden?: boolean;
    shipping_amount?: {
      currency_code?: string;
      value?: string;
    };
    start_time?: string;
    update_time?: string;
    billing_info?: {
      outstanding_balance: {
        currency_code?: string;
        value?: string;
      };
      cycle_executions: Array<object>;
      /*        [
                {
              tenure_type: REGULAR,
              sequence: 1,
              cycles_completed: 1,
              cycles_remaining: 0,
              current_pricing_scheme_version: 1,
              total_cycles: 0,
            }, ], */
      last_payment: {
        amount: {
          currency_code?: string;
          value?: string;
        };
        time?: string;
      };
      next_billing_time?: string;
      failed_payments_count?: number;
    };
  };
}

