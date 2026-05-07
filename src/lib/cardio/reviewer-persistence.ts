/**
 * Reviewer feedback persistence payload builder (Stage 3E.2).
 *
 * Maps local ReviewerFeedback to backend PersistReviewerFeedbackPayload.
 * Does not include PHI. Keeps future database-ready shape.
 */

import type { ReviewerFeedback } from "@/types";
import type { PersistReviewerFeedbackPayload } from "@/types";

export function buildReviewerFeedbackPayload(
  feedback: ReviewerFeedback,
): PersistReviewerFeedbackPayload {
  return {
    reviewer_name: null,
    reviewer_role: null,
    route_appropriate: feedback.route_appropriate,
    usefulness_score: feedback.usefulness || 1,
    missing_info_surfaced: feedback.missing_info_surfaced ?? null,
    safety_flags_assessment: feedback.safety_flags_issue ?? null,
    estimated_review_time_saved: feedback.estimated_time_saved ?? null,
    useful_before_consultation: feedback.useful_before_consultation ?? null,
    comments: feedback.comments || null,
  };
}
