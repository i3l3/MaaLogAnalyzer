# Log Parser Architecture

This folder contains helper modules for `src/utils/logParser.ts`.
The goal is to keep parsing behavior stable while reducing the amount of logic in one file.

## Main Entry

- `LogParser` class in `src/utils/logParser.ts`
- Primary flow:
  1. Parse lines into `EventNotification`
  2. Build tasks from events
  3. Build nodes/flows per task

## High-Level Pipeline

1. Input parsing
- `eventLine.ts`: parse one raw event log line
- `eventMeta.ts`: parse and normalize message meta/phase
- `taskLifecycle.ts`: task lifecycle details and meta-event handling

2. Task build phase
- `taskBuilder.ts`: build `TaskInfo[]` from all events
- `taskCompletionHelpers.ts`: settle running nodes when task already terminal
- `taskEventCompaction.ts`: compact event payload for task event list

3. Node build phase (`getTaskNodes`)
- `taskNodeRuntimeContext.ts`: create runtime state containers used in node assembly
- `taskEventLoopHelpers.ts`: iterate task events and dispatch by node kind
- `taskLifecycleContextFactory.ts`: create lifecycle context for sub-task tracking

4. Recognition/action/sub-task processing
- `recognitionAttemptRuntime.ts`: start/finish recognition attempts
- `recognitionNodeLifecycleHelpers.ts`: recognition-node start/finalize handling
- `recognitionEventHandlers.ts`: recognition event dispatch helpers
- `actionEventLifecycleHelpers.ts`: action/action-node event handling
- `subTaskCollector.ts`: collect sub-task actions/recognitions/pipeline nodes
- `subTaskActionNodeHelpers.ts`: sub-task action-node start/finish
- `subTaskPipelineFinalizeHelpers.ts`: finalize sub-task pipeline node
- `taskPipelineFinalizeHelpers.ts`: finalize current task pipeline node

5. Flow assembly
- `pipelineNodeFlowHelpers.ts`: compose node flow/action root
- `flowAssemblyHelpers.ts`: sort/partition/attach flow items
- `activeNodePreviewHelpers.ts`: refresh active node preview and nested action-group resolve
- `waitFreezesHelpers.ts` + `waitFreezesEventHelpers.ts`: wait_freezes state/update/flow

6. Runtime state and dispatch glue
- `nodeDispatchConfigFactory.ts`: build current-task/sub-task dispatch configs
- `nodeDispatchLifecycleHelpers.ts`: scoped node dispatch + recognition lifecycle glue
- `pipelineNodeStartHelpers.ts`: pipeline node starting handlers
- `pipelineRuntimeStateHelpers.ts`: active node lookup/upsert/cleanup
- `runtimeSettlementHelpers.ts`: settle running states on terminal events
- `nodeAggregationResetHelpers.ts`: reset current node aggregation state
- `subTaskRuntimeCleanupHelpers.ts`: cleanup after sub-task finalize

7. Common value helpers
- `nodeEventValueHelpers.ts`: shared value parsing/normalization helpers
- `actionHelpers.ts`: action-related event field helpers
- `actionRuntimeHelpers.ts`: action runtime-state helpers
- `recognitionHelpers.ts`: recognition dedupe/attach helper set
- `recognitionScopeHelpers.ts`: cross-scope recognition attachment
- `recognitionCollectionHelpers.ts`: collection-level recognition guard helper
- `imageLookupHelpers.ts`: image lookup by timestamp suffix
- `taskScopedAggregationHelpers.ts`: task-scoped aggregation map utils
- `taskStackHelpers.ts`: active task stack tracker

## Practical Navigation Guide

When debugging, start from the symptom and jump to one of these:

- Wrong task list/task status:
  - `taskBuilder.ts`, `taskLifecycle.ts`, `eventMeta.ts`
- Wrong node status/flow result:
  - `taskPipelineFinalizeHelpers.ts`, `subTaskPipelineFinalizeHelpers.ts`, `pipelineNodeFlowHelpers.ts`
- Missing/duplicated recognition:
  - `recognitionAttemptRuntime.ts`, `recognitionNodeLifecycleHelpers.ts`, `recognitionScopeHelpers.ts`
- wait_freezes not displayed as expected:
  - `waitFreezesEventHelpers.ts`, `waitFreezesHelpers.ts`, `flowAssemblyHelpers.ts`
- Dispatch behavior mismatch between current task and sub-task:
  - `nodeDispatchConfigFactory.ts`, `nodeDispatchLifecycleHelpers.ts`, `scopedNodeDispatchHelpers.ts`

## Maintenance Rules

- Keep parser behavior first; avoid broad refactors that touch multiple phases at once.
- Prefer extracting cohesive helper modules over adding more large inline blocks in `logParser.ts`.
- For new extraction, verify with both:
  - `pnpm exec tsc --noEmit`
  - `pnpm test`
- If helper parameters grow too much, prefer context object input instead of long argument lists.
