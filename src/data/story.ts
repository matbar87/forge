// "Moja historia" (My story): from the start of Session 7 the event app asks
// participants to describe their story from Kuźnia in an external form. The
// badge in the header, the notice that opens on entering the app and the
// button under Session 7's questions all link to it.
import { plan } from './plan';
import { questions } from './questions';
import { UNLOCK_OPEN, sessionUnlockAt } from './unlock';

export const STORY_FORM_URL = 'https://forms.gle/yXgqALzZtr3fc4oT6';

/** 1-based number of the Group Time session the story belongs to. */
export const STORY_SESSION = 7;

// Used only if Session 7 can't be found in the plan (and has no unlock time
// of its own): its planned start, 14 Nov 15:00 on the viewer's device clock.
const FALLBACK_START = new Date(2026, 10, 14, 15, 0, 0);

const unlock = questions.pl.sessions[STORY_SESSION - 1]?.unlock;

/**
 * When the story badge, notice and button appear: the same moment Session 7's
 * questions unlock (its start in the plan, unless set otherwise in the panel),
 * so all of them show up together. null = right away ('open').
 */
export const STORY_START: Date | null =
  (unlock ?? '').trim() === UNLOCK_OPEN
    ? null
    : sessionUnlockAt(unlock, STORY_SESSION, plan) ?? FALLBACK_START;

export const isStoryActive = (now = new Date()) => !STORY_START || now >= STORY_START;
