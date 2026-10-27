# edge: plan

A personal PWA (iPhone and web) to stay sharp as a senior engineer: hard multiple-choice questions on spaced repetition, with short lessons. Target roles: principal FE or BE, product engineer, FE, full stack, software engineer. Depth: senior and staff interview level.

## Why it exists

Interview prep tools (LeetCode, GreatFrontEnd, Hello Interview, ByteByteGo) are desktop tools for a cram before interviews. Nobody serves retention after the interview, and system design on a phone is not served at all. edge keeps the knowledge alive with 15 minutes a day.

## Learning design

1. **Lesson:** pretest (2 or 3 questions) > read (one idea per screen, dense, for experts) > 4 to 6 questions. Right and sure in the pretest: first review comes later (FSRS Easy). Misses in the pretest are not lapses.
2. **Recall first:** every card shows the question, you think of the answer, then you tap "show options".
3. **Questions:** 3 options (4 when the fourth is a real misconception). Each wrong option is a real misconception. No tricks, no "none of the above", no "which is NOT".
4. **Feedback:** after every answer, why the right option is right and why each wrong option is wrong.
5. **Confidence:** sure or unsure on each answer. Wrong = Again, right and unsure = Hard, right and sure = Good. Sure but wrong gets the strongest feedback. Progress shows calibration.
6. **Variants:** one card is one concept with 2 to 4 variants (new code, new scenario). A review always shows the next variant. Options are shuffled.
7. **Load:** 2 or 3 new concepts a day on the phone, longer lessons at the desk. New material in blocks of 2 or 3 tracks; reviews mix all tracks.
8. **Desk sessions:** system design case studies as chains of 8 to 10 linked questions.

Research behind it: Little and Bjork 2012 (competitive options), Butler and Roediger 2008 (feedback), Rodriguez 2005 (3 options), Butterfield and Metcalfe 2001 (hypercorrection), Richland 2009 and Pan and Carpenter 2023 (pretesting), Rawson and Dunlosky 2022 (successive relearning), Kalyuga 2007 (expertise reversal), Brunmair and Richter 2019 (interleaving).

## Content quality

- Claude subagents write each module, a strict reviewer agent checks it.
- Every claim cites a primary source (spec, MDN, official docs, RFC, book) with a quote.
- A test runs every "predict the output" snippet and checks the right option.
- Questions on a framework version carry the version and a review date.
- A "flag this question" button. Target: about 80% stable concepts, 20% framework details.
- Pilot: the first module (about 50 questions) is checked by hand before more content.

## Tracks

All tracks are visible and open. Content arrives in waves.

**v1:** JS/TS language, browser and web platform, React and frameworks, FE system design, backend and system design (with SQL depth, data modeling, testing strategy, infra and CI/CD, backend performance, authorization), DSA patterns.

**Next waves:** AI engineering, Go (4 or 5 modules), Ruby and Rails (4 or 5 modules), principal and product engineering, behavioral (story recall cards; stories written at the desk).

Shared topics (caching, auth, feed, chat) have one owner track and cross-links.

## Stack

Copy of vo2: Next 16, Neon and drizzle, Better Auth with an invite list, ts-fsrs, Liquid Glass tab bar. Clean Linear-like look. No AI in the app. Public repo `tomrenard/edge`.

## Milestones

- **M1:** copy vo2, Linear look, engine changes (pretest, code blocks, web sources, version tags, snippet tests), pilot module "JS: event loop".
- **M2:** tracks and focus role, placement, React and browser modules, daily new cap.
- **M3:** system design and DSA modules, case-study chains.
- **M4:** next waves, weekly news cards.
