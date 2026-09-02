"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockEventProvider = void 0;
const eventProvider_interface_1 = require("./eventProvider.interface");
class MockEventProvider {
    providerName = 'MOCK_ACE_PROVIDER';
    async fetchEvents() {
        const now = new Date();
        const rawEvents = [
            {
                title: 'HackGURU AI Ingestion Hackathon 2026',
                description: 'Ingested AI Hackathon for testing real-time event pipeline.',
                category: 'AI & ML',
                eligibility: 'All Engineering Students',
                requiredSkills: ['Python', 'TypeScript', 'Gemini API'],
                location: 'Bengaluru / Online',
                duration: '36 Hours',
                startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                organizer: 'AllCollegeEvent AI Team',
                externalUrl: 'https://allcollegeevent.com/events/imported-1',
            },
        ];
        return rawEvents.map((r) => eventProvider_interface_1.EventNormalizer.normalizeRawEvent(r));
    }
}
exports.MockEventProvider = MockEventProvider;
