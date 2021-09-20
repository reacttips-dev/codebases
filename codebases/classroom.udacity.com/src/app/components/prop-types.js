import PropTypes from 'prop-types';

/* Common custom ClassroomPropTypes */
function nodeShape(propTypes) {
    return PropTypes.shape({
        id: PropTypes.number,
        key: PropTypes.string,
        semantic_type: PropTypes.string,
        ...propTypes,
    });
}

const file = PropTypes.shape({
    uri: PropTypes.string,
    mime_type: PropTypes.string,
    size: PropTypes.number,
    name: PropTypes.string,
});

const studyScheduleReminder = PropTypes.shape({
    send_at: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
});

const resources = PropTypes.shape({
    files: PropTypes.arrayOf(file),
    google_plus_link: PropTypes.string,
    coaching_appointments_link: PropTypes.string,
    office_hours_link: PropTypes.string,
    career_resource_center_link: PropTypes.string,
});

const node = nodeShape({});

const course = nodeShape({});

const nanodegree = nodeShape({
    enrollment: PropTypes.shape({}),
});

const part = nodeShape({});

const curriculum = PropTypes.arrayOf(PropTypes.oneOfType([part]));

const project = nodeShape({
    description: PropTypes.string,
    resources,
});

const lesson = nodeShape({});

const concept = nodeShape({});

const textAtom = nodeShape({
    text: PropTypes.string.isRequired,
});

const imageAtom = nodeShape({
    url: PropTypes.string.isRequired,
    non_google_url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    caption: PropTypes.string,
    alt: PropTypes.string,
    annotations: PropTypes.array,
});

const video = PropTypes.shape({
    youtube_id: PropTypes.string.isRequired,
    china_cdn_id: PropTypes.string,
});

const videoAtom = nodeShape({
    video: video.isRequired,
});

const checkboxQuizAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.shape({
        prompt: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
            })
        ),
    }).isRequired,
});

const radioQuizAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.shape({
        prompt: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
            })
        ),
    }).isRequired,
});

const taskListAtom = nodeShape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    positive_feedback: PropTypes.string,
    video_feedback: video,
    tasks: PropTypes.array.isRequired,
});

const reflectAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.string.isRequired,
    }).isRequired,
    answer: PropTypes.shape({
        text: PropTypes.string,
    }),
});

const validatedQuizAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.shape({
        title: PropTypes.string,
        prompt: PropTypes.string.isRequired,
    }).isRequired,
});

const matchingQuizAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.shape({
        complex_prompt: PropTypes.shape({
            text: PropTypes.string.isRequired,
        }),
        concepts: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
            })
        ),
        answers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
            })
        ),
    }).isRequired,
});

const quizAtom = nodeShape({
    id: PropTypes.number.isRequired,
    question: PropTypes.object.isRequired,
    instruction: PropTypes.object,
    answer: PropTypes.object,
});

const workspaceAtom = nodeShape({
    pool_id: PropTypes.string.isRequired,
    workspace_id: PropTypes.string.isRequired,
    view_id: PropTypes.string.isRequired,
    gpu_capable: PropTypes.bool,
    configuration: PropTypes.any.isRequired,
    onAutoAdvance: PropTypes.func,
    starter_files: PropTypes.string,
});

const embeddedFrameAtom = nodeShape({
    id: PropTypes.number.isRequired,
    external_uri: PropTypes.string.isRequired,
});

const atom = PropTypes.oneOfType([
    checkboxQuizAtom,
    embeddedFrameAtom,
    imageAtom,
    matchingQuizAtom,
    quizAtom,
    radioQuizAtom,
    reflectAtom,
    taskListAtom,
    textAtom,
    validatedQuizAtom,
    videoAtom,
    workspaceAtom,
]);

// Subscription and Billing
const billingMethod = PropTypes.shape({
    urn: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    credit_card: PropTypes.shape({
        name: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        exp_month: PropTypes.string.isRequired,
        exp_year: PropTypes.string.isRequired,
        last4: PropTypes.string.isRequired,
        address: PropTypes.shape({
            line1: PropTypes.string.isRequired,
            line2: PropTypes.string,
            city: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            postal_code: PropTypes.string.isRequired,
        }),
    }).isRequired,
});

const billingInfo = PropTypes.shape({
    auto_renew_eligible: PropTypes.bool,
    billing_methods: PropTypes.arrayOf(billingMethod),
});

const PaymentMethod = PropTypes.shape({
    description: PropTypes.string,
    processor: PropTypes.string,
    processor_data: PropTypes.object,
    supports_auto_renew: PropTypes.bool,
    type: PropTypes.string,
    urn: PropTypes.string,
});

const PaymentAmount = PropTypes.shape({
    currency: PropTypes.string,
    display: PropTypes.string,
    major: PropTypes.string,
    minor: PropTypes.number,
});

const PaymentHistoryItem = PropTypes.shape({
    charge: PropTypes.shape({
        amount: PaymentAmount,
        failure_code: PropTypes.string,
        failure_reason: PropTypes.string,
        payment_method: PaymentMethod,
        status: PropTypes.string,
        urn: PropTypes.string,
    }),
    line_items: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PaymentAmount,
            description: PropTypes.string,
            kind: PropTypes.string,
        })
    ),
    refunds: PropTypes.array,
    total_amount: PaymentAmount,
    total_amount_refunded: PaymentAmount,
    urn: PropTypes.string,
});

const purchasedProduct = PropTypes.shape({
    cohort_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    nanodegree_key: PropTypes.string,
    term_id: PropTypes.string,
    type: PropTypes.string,
    urn: PropTypes.string,
});

const recurringAmount = PropTypes.shape({
    currency: PropTypes.string,
    discount_amount: PropTypes.number,
    discount_amount_display: PropTypes.string,
    original_amount: PropTypes.number,
    original_amount_display: PropTypes.string,
    payable_amount: PropTypes.number,
    payable_amount_display: PropTypes.string,
});

const paymentPlan = PropTypes.shape({
    description: PropTypes.string,
    recurring_amount: recurringAmount,
    recurring_interval: PropTypes.string,
    recurring_interval_count: PropTypes.number,
    type: PropTypes.string,
    upfront_amount: PropTypes.object,
    upfront_interval: PropTypes.string,
    upfront_interval_count: PropTypes.number,
});

const historicOrder = PropTypes.shape({
    can_refund: PropTypes.bool,
    can_uncancel: PropTypes.bool,
    cancel_url: PropTypes.string,
    created_at: PropTypes.string,
    currency: PropTypes.string,
    event_history: PropTypes.array,
    next_payment: PropTypes.object,
    original_price: PaymentAmount,
    payment_method: PaymentMethod,
    payment_history: PropTypes.arrayOf(PaymentHistoryItem),
    payment_plan: paymentPlan,
    purchased_product_description: PropTypes.string,
    purchased_products: PropTypes.arrayOf(purchasedProduct),
    status: PropTypes.string,
    total_amount_charged: PaymentAmount,
    total_amount_refunded: PaymentAmount,
    type: PropTypes.string,
    updated_at: PropTypes.string,
    urn: PropTypes.string,
});

const nextPayment = PropTypes.shape({
    can_auto_renew: PropTypes.bool.isRequired,
    due_at: PropTypes.string.isRequired,
    payment_url: PropTypes.string.isRequired,
    total_amount: PropTypes.object.isRequired,
});

const prevPayment = PropTypes.shape({
    invoice: PropTypes.shape({
        urn: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        total_amount: PropTypes.string.isRequired,
    }),
});

const paymentHistory = PropTypes.arrayOf(prevPayment);

const termPurchase = PropTypes.shape({
    urn: PropTypes.string.isRequired,
    provider: PropTypes.string,
    product_key: PropTypes.string,
    product_variant: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    amount: PropTypes.number,
    amount_display: PropTypes.string,
    currency: PropTypes.string,
    cohort_id: PropTypes.number,
    term_id: PropTypes.number,
    purchased_at: PropTypes.string,
    started_at: PropTypes.string,
    can_self_cancel: PropTypes.bool,
    payment_method: PropTypes.shape({
        type: PropTypes.string,
    }),
});

const subscription = PropTypes.shape({
    id: PropTypes.string,
    urn: PropTypes.string.isRequired,
    name: PropTypes.string,
    status: PropTypes.string,
    amount: PropTypes.number,
    amount_display: PropTypes.string,
    invoice_amount: PropTypes.string,
    currency: PropTypes.currency,
    current_period_end_at: PropTypes.string,
    current_period_started_at: PropTypes.string,
    cancel_at_period_end: PropTypes.string,
    canceled_at: PropTypes.string,
    coupon: PropTypes.shape({
        percent_off: PropTypes.string,
    }),
    metadata: PropTypes.shape({
        github_promo: PropTypes.string,
    }),
    trial_end: PropTypes.string,
    refundability: PropTypes.string,
    started_at: PropTypes.string,
    product_key: PropTypes.string,
    provider: PropTypes.string,
    product_variant: PropTypes.string,
    invoice_urn: PropTypes.string,
});

const term = PropTypes.shape({
    id: PropTypes.number,
    part_keys: PropTypes.arrayOf(PropTypes.string),
});

const cohort = PropTypes.shape({
    id: PropTypes.number,
    start_at: PropTypes.string,
    term,
});

const program = PropTypes.oneOfType([nanodegree, course]);

const enrollment = PropTypes.shape({
    key: PropTypes.string,
    version: PropTypes.string,
    locale: PropTypes.string,
});

const user = PropTypes.shape({
    id: PropTypes.string.isRequired,
    settings: PropTypes.shape({
        dismissed_upgrade_ids: PropTypes.array,
        onboarding_completed_keys: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
});

const lab = PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired, //in minutes
    partner_logos: PropTypes.array,
    overview: PropTypes.shape({
        video: PropTypes.shape({
            // video
            topher_id: PropTypes.string,
            youtube_id: PropTypes.string,
        }),
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        key_takeaways: PropTypes.array.isRequired,
    }),
    evaluation_objective: PropTypes.string.isRequired,
    review_video: PropTypes.shape({
        // video
        topher_id: PropTypes.string,
        youtube_id: PropTypes.string,
    }),
    details: PropTypes.shape({
        text: PropTypes.string.isRequired,
    }),
    workspace: workspaceAtom,
    result: PropTypes.shape({
        state: PropTypes.oneOf(['unsubmitted', 'passed', 'failed']),
        skill_confidence_rating_after: PropTypes.oneOf([1, 2, 3, 4, 5]),
        skill_confidence_rating_before: PropTypes.oneOf([1, 2, 3, 4, 5]),
    }),
});

const schedule = PropTypes.shape({
    email: PropTypes.bool.isRequired,
    user_timezone: PropTypes.string.isRequired,
});

const assessment = PropTypes.oneOfType([lab, project]);

// fetched from the community-api (hub)
const mentor = PropTypes.shape({
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    bio: PropTypes.string,
    uid: PropTypes.string,
});

export default {
    assessment,
    enrollment,
    lab,
    user,
    resources,

    /* Nodes / Content Structure */
    node,
    program,
    course,
    nanodegree,
    part,
    curriculum,
    project,
    lesson,
    module: nodeShape({}) /* Can't define this outside of here, as it will overwrite the commonjs `module` */ ,
    concept,

    /* Common */
    video,

    /* Atoms */
    atom,
    checkboxQuizAtom,
    embeddedFrameAtom,
    imageAtom,
    matchingQuizAtom,
    quizAtom,
    radioQuizAtom,
    reflectAtom,
    taskListAtom,
    textAtom,
    validatedQuizAtom,
    videoAtom,
    workspaceAtom,

    /* Payments */
    billingInfo,
    billingMethod,
    nextPayment,
    prevPayment,
    paymentHistory,
    paymentPlan,
    purchasedProduct,
    historicOrder,
    termPurchase,
    subscription,

    /* Onboarding */
    studyScheduleReminder,
    schedule,
    mentor,

    /* Business Units */
    cohort,
    term,
};