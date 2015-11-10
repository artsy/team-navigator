var _ = require('lodash');
var sinon = require('sinon');
var teamify = require('../../lib/teamify');
var members = require('../fixtures/members');
var teams = require('../fixtures/teams');

describe('teamify', function() {
  it('returns team name even when it is missing from the teams list', function() {
    var output = teamify(members, teams);
    _.pluck(output, 'name').should.eql([
      'Genome',
      'Institutions & Auctions',
      'Gallery Relations',
      'Fair Relations',
      'Editorial',
      'Curator at Large',
      'Fair Partnerships',
      'Gallery Partnerships',
      'Collector Relations',
      'Brand Partnerships',
      'Communications',
      'Performance Marketing',
      'Product',
      'Engineering',
      'Operations',
      'Legal',
      'Finance',
      'Leadership'
    ]);
  });
});
