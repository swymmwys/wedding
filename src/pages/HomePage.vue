<script setup lang="ts">
import AmbientMusic from '@/features/settings/AmbientMusic.vue'
import CountdownSection from '@/features/invitation/CountdownSection.vue'
import DetailsSection from '@/features/invitation/DetailsSection.vue'
import DressCodeSection from '@/features/invitation/DressCodeSection.vue'
import GiftsSection from '@/features/invitation/GiftsSection.vue'
import HeroSection from '@/features/invitation/HeroSection.vue'
import IntroOverlay from '@/features/invitation/IntroOverlay.vue'
import ScheduleSection from '@/features/invitation/ScheduleSection.vue'
import TransportSection from '@/features/invitation/TransportSection.vue'
import RsvpSection from '@/features/rsvp/RsvpSection.vue'
</script>

<template>
  <IntroOverlay />
  <AmbientMusic />
  <main class="home-page">
    <HeroSection />
    <CountdownSection />
    <DetailsSection />
    <ScheduleSection />
    <DressCodeSection />
    <TransportSection />
    <GiftsSection />
    <RsvpSection />
  </main>
</template>
