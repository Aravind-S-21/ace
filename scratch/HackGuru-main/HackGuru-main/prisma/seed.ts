import { PrismaClient, Difficulty, EventType, ActionType, NotificationType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Skills (20)
  const skillsData = [
    { name: 'Python', category: 'Programming Languages' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'PyTorch', category: 'Machine Learning' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'TensorFlow', category: 'Machine Learning' },
    { name: 'Flutter', category: 'Mobile Development' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'SQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'GraphQL', category: 'API' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'Machine Learning', category: 'Artificial Intelligence' },
    { name: 'Data Science', category: 'Data Science' },
    { name: 'C++', category: 'Programming Languages' },
    { name: 'Java', category: 'Programming Languages' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Git', category: 'Tools' },
    { name: 'Cyber Security', category: 'Security' },
  ];

  const createdSkills = [];
  for (const sk of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { name: sk.name },
      update: {},
      create: sk,
    });
    createdSkills.push(skill);
  }
  console.log(`✅ Seeded ${createdSkills.length} skills.`);

  // 2. Seed Interests (20)
  const interestsData = [
    { name: 'Generative AI', category: 'Artificial Intelligence' },
    { name: 'Web Development', category: 'Software Development' },
    { name: 'Machine Learning', category: 'Artificial Intelligence' },
    { name: 'Open Source', category: 'Community' },
    { name: 'Mobile App Development', category: 'Software Development' },
    { name: 'Cloud Computing', category: 'Infrastructure' },
    { name: 'Cybersecurity', category: 'Security' },
    { name: 'Data Analytics', category: 'Data' },
    { name: 'Competitive Programming', category: 'Algorithms' },
    { name: 'Game Development', category: 'Entertainment' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'DevOps', category: 'Infrastructure' },
    { name: 'Blockchain', category: 'Web3' },
    { name: 'Robotics', category: 'Hardware' },
    { name: 'Embedded Systems', category: 'Hardware' },
    { name: 'FinTech', category: 'Domain' },
    { name: 'EdTech', category: 'Domain' },
    { name: 'BioTech', category: 'Domain' },
    { name: 'Product Management', category: 'Management' },
    { name: 'System Design', category: 'Architecture' },
  ];

  const createdInterests = [];
  for (const intr of interestsData) {
    const interest = await prisma.interest.upsert({
      where: { name: intr.name },
      update: {},
      create: intr,
    });
    createdInterests.push(interest);
  }
  console.log(`✅ Seeded ${createdInterests.length} interests.`);

  // 3. Seed Students (10)
  const passwordHash = await bcrypt.hash('password123', 10);
  const studentProfiles = [];

  const rawStudents = [
    { name: 'Aarav Sharma', branch: 'Computer Science', year: 3, degree: 'B.Tech', location: 'Bengaluru, India', goal: 'AI Research Scientist' },
    { name: 'Ananya Verma', branch: 'Information Technology', year: 4, degree: 'B.Tech', location: 'Delhi, India', goal: 'Full Stack Engineer' },
    { name: 'Rohan Gupta', branch: 'Data Science', year: 2, degree: 'B.Tech', location: 'Mumbai, India', goal: 'ML Ops Engineer' },
    { name: 'Priya Nair', branch: 'Electronics & Communication', year: 3, degree: 'B.Tech', location: 'Chennai, India', goal: 'Robotics & AI Engineer' },
    { name: 'Vikram Singh', branch: 'Computer Science', year: 1, degree: 'B.Tech', location: 'Hyderabad, India', goal: 'Software Engineer' },
    { name: 'Neha Kulkarni', branch: 'Artificial Intelligence', year: 3, degree: 'B.Tech', location: 'Pune, India', goal: 'Generative AI Developer' },
    { name: 'Siddharth Menon', branch: 'Computer Science', year: 4, degree: 'B.Tech', location: 'Bengaluru, India', goal: 'Cloud Solutions Architect' },
    { name: 'Kavya Patel', branch: 'Information Technology', year: 2, degree: 'B.Tech', location: 'Ahmedabad, India', goal: 'Mobile Developer (Flutter)' },
    { name: 'Aditya Rao', branch: 'Cyber Security', year: 3, degree: 'B.Tech', location: 'Kolkata, India', goal: 'Security Analyst' },
    { name: 'Meera Iyer', branch: 'Computer Science', year: 4, degree: 'B.Tech', location: 'Chennai, India', goal: 'Product Manager' },
  ];

  for (let i = 0; i < rawStudents.length; i++) {
    const sData = rawStudents[i];
    const email = `student${i + 1}@college.edu`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: Role.STUDENT,
      },
    });

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: sData.name,
        collegeName: 'Indian Institute of Technology / National Institute of Technology',
        branch: sData.branch,
        yearOfStudy: sData.year,
        degree: sData.degree,
        location: sData.location,
        careerGoal: sData.goal,
        bio: `Passionate ${sData.branch} student focusing on ${sData.goal}.`,
      },
    });

    // Assign 3 skills
    const assignedSkills = [
      createdSkills[i % createdSkills.length],
      createdSkills[(i + 3) % createdSkills.length],
      createdSkills[(i + 7) % createdSkills.length],
    ];

    for (const sk of assignedSkills) {
      await prisma.studentSkill.upsert({
        where: {
          studentId_skillId: {
            studentId: profile.id,
            skillId: sk.id,
          },
        },
        update: {},
        create: {
          studentId: profile.id,
          skillId: sk.id,
          proficiencyLevel: i % 2 === 0 ? 'ADVANCED' : 'INTERMEDIATE',
        },
      });
    }

    // Assign 3 interests
    const assignedInterests = [
      createdInterests[i % createdInterests.length],
      createdInterests[(i + 2) % createdInterests.length],
      createdInterests[(i + 5) % createdInterests.length],
    ];

    for (const intr of assignedInterests) {
      await prisma.studentInterest.upsert({
        where: {
          studentId_interestId: {
            studentId: profile.id,
            interestId: intr.id,
          },
        },
        update: {},
        create: {
          studentId: profile.id,
          interestId: intr.id,
        },
      });
    }

    // Notification preferences
    await prisma.notificationPreference.upsert({
      where: { studentId: profile.id },
      update: {},
      create: {
        studentId: profile.id,
        enableDeadlineAlerts: true,
        enableRecommendationAlerts: true,
        emailNotifications: true,
        pushNotifications: true,
      },
    });

    studentProfiles.push(profile);
  }
  console.log(`✅ Seeded ${studentProfiles.length} student profiles with skills, interests, and preferences.`);

  // 4. Seed Events (50 Events, including several AI Hackathons)
  const eventCategories = ['AI & ML', 'Web Development', 'Mobile Dev', 'Cybersecurity', 'Competitive Coding', 'Open Source'];
  const eventTypes: EventType[] = [EventType.HACKATHON, EventType.WORKSHOP, EventType.COMPETITION, EventType.INTERNSHIP, EventType.SEMINAR];
  const difficulties: Difficulty[] = [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.ALL_LEVELS];

  const createdEvents = [];
  const now = new Date();

  const titlePrefixes = [
    'HackGURU National AI Hackathon 2026',
    'Global Generative AI Challenge',
    'NextGen Web3 & AI Summit',
    'Deep Learning Systems Workshop',
    'Full Stack Innovation Sprint',
    'Flutter Cross-Platform Hackathon',
    'CyberDefense Capture The Flag',
    'Algorithmic Coding Championship',
    'Cloud Native Microservices Internship',
    'Autonomous Robotics & Computer Vision Challenge',
  ];

  for (let i = 1; i <= 50; i++) {
    const isAI = i % 2 === 1 || i <= 15;
    const category = isAI ? 'AI & ML' : eventCategories[i % eventCategories.length];
    const eventType = isAI && i <= 20 ? EventType.HACKATHON : eventTypes[i % eventTypes.length];

    const title = i <= titlePrefixes.length
      ? titlePrefixes[i - 1]
      : `${category} ${eventType} 2026 - Edition #${i}`;

    const startDate = new Date(now.getTime() + (i * 2 - 10) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const registrationDeadline = new Date(startDate.getTime() - 2 * 24 * 60 * 60 * 1000);

    const reqSkills = isAI
      ? ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning']
      : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'];

    const event = await prisma.event.create({
      data: {
        title,
        description: `Join us for ${title}! An immersive ${eventType.toLowerCase()} event focusing on ${category}. Great learning opportunity for students looking to excel in technology.`,
        category,
        eligibility: i % 3 === 0 ? 'Engineering Undergraduates (3rd & 4th Year)' : 'All College Students',
        requiredSkills: reqSkills,
        location: i % 4 === 0 ? 'Online / Remote' : i % 3 === 0 ? 'Bengaluru, India' : 'Delhi, India',
        duration: '48 Hours',
        startDate,
        endDate,
        registrationDeadline,
        organizer: `AllCollegeEvent Partner Network - ${category} Division`,
        externalUrl: `https://allcollegeevent.com/events/${i}`,
        imageUrl: `https://images.allcollegeevent.com/events/${i}.jpg`,
        isRaw: false,
      },
    });

    // Create Event Intelligence for each event
    await prisma.eventIntelligence.create({
      data: {
        eventId: event.id,
        domains: isAI ? ['Artificial Intelligence', 'Generative AI', 'Data Science'] : ['Web Development', 'Software Engineering'],
        skills: reqSkills,
        targetAudience: ['Undergraduate Students', 'Developers', 'Tech Enthusiasts'],
        difficulty: difficulties[i % difficulties.length],
        careerPaths: isAI ? ['AI Engineer', 'ML Researcher', 'Data Scientist'] : ['Full Stack Engineer', 'Backend Developer'],
        prerequisites: isAI ? ['Basic Python', 'Linear Algebra'] : ['JavaScript Basics', 'HTML/CSS'],
        learningOutcomes: ['Hands-on project experience', 'Industry Mentorship', 'Certificate of Completion'],
        eventType,
        contentHash: `hash_event_${event.id}_v1`,
      },
    });

    createdEvents.push(event);
  }
  console.log(`✅ Seeded ${createdEvents.length} events with pre-calculated intelligence.`);

  // 5. Seed Interactions (100+)
  const actions: ActionType[] = [
    ActionType.VIEW,
    ActionType.SAVE,
    ActionType.REGISTER,
    ActionType.SHARE,
    ActionType.DISMISS,
    ActionType.CALENDAR_ADD,
  ];

  let interactionCount = 0;
  for (let sIdx = 0; sIdx < studentProfiles.length; sIdx++) {
    const student = studentProfiles[sIdx];
    // Each student interacts with 10-15 events
    const eventSubset = createdEvents.slice(sIdx * 4, sIdx * 4 + 12);
    for (const ev of eventSubset) {
      const act = actions[Math.floor(Math.random() * actions.length)];
      await prisma.interaction.create({
        data: {
          studentId: student.id,
          eventId: ev.id,
          action: act,
          metadata: { timestamp: new Date().toISOString(), platform: 'web' },
        },
      });
      interactionCount++;
    }
  }
  console.log(`✅ Seeded ${interactionCount} student interactions.`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
